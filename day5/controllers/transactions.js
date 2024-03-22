const xlsx = require("xlsx");
const db = require("../models");
const { downloadCsv } = require("../utils/helper");
const Transaction = db.transaction;

exports.createByImporting = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    let data;

    if (req.file.mimetype === "text/csv") {
      // Process CSV file
      const fileBuffer = req.file.buffer.toString("utf8");
      data = fileBuffer.split("\n").map((row) => row.split(","));
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Process Excel file
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const columns = [
      "order_id",
      "user_id",
      "shipping_dock_id",
      "amount",
      "discount",
      "tax",
      "total",
      "notes",
      "status",
    ];
    console.log(data[0]);
    if (columns.length !== data[0]?.length) {
      return res.status(400).json({
        error: true,
        message: "This file doesn't match!",
      });
    }
    columns.map((clm) => {
      if (!data[0]?.includes(clm))
        return res.status(400).json({
          error: true,
          message: "This file doesn't match!",
        });
    });

    const payload = [];
    for (const row of data.slice(1)) {
      //   const record = new Transaction({
      payload.push({
        order_id: row[0],
        user_id: row[1],
        shipping_dock_id: row[2],
        amount: row[3],
        discount: row[4],
        tax: row[5],
        total: row[6],
        notes: row[7],
        status: row[8],
      });
      //   await record.save();
    }
    // res.status(200).json({ payload });
    await Transaction.bulkCreate(payload);
    res.status(200).json({
      error: false,
      message: "Imported successfully.",
      result: payload,
    });
  } catch (error) {
    res.status(400).json({
      error: false,
      message: error?.message,
    });
  }
};

exports.getAllTransactions = async (_req, res) => {
  try {
    const result = await Transaction.findAll({
      order: [["id", "DESC"]],
    });
    res
      .status(200)
      .json({ error: false, message: "All transactions", list: result });
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

exports.exportCsv = async (_req, res) => {
  try {
    const transactions = await Transaction.findAll();
    const fields = [
      "id",
      "order_id",
      "user_id",
      "shipping_dock_id",
      "amount",
      "discount",
      "tax",
      "total",
      "notes",
      "status",
    ];
    // fileName, fields, data
    return downloadCsv(res, "Transactions.csv", fields, transactions);
  } catch (error) {
    console.error("Error downloading CSV file:", error);
    res.status(500).json({ error: "Error downloading CSV file" });
  }
};
