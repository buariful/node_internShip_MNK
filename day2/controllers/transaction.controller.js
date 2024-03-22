const db = require("../models");
const Transaction = db.transaction;

exports.createTransaction = async (req, res) => {
  try {
    const result = await Transaction.create(req.body);

    res.status(201).json({
      error: false,
      message: "Shipping successful",
      data: result?.id,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error?.message });
  }
  // .then((shippingDock) => {
  //   res.status(201).json(shippingDock);
  // })
  // .catch((error) => {
  //   res.status(400).json({ error: error.message });
  // });
};

exports.getAllTransaction = async (_req, res) => {
  try {
    const result = await Transaction.findAll({});
    res.status(200).json({
      error: false,
      message: "successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
exports.getSingleTransaction = async (req, res) => {
  try {
    const result = await Transaction.findOne({
      where: {
        id: req?.params?.id,
      },
    });
    res.status(200).json({
      error: false,
      message: "successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
exports.updateTransaction = async (req, res) => {
  try {
    const result = await Transaction.update(req.body, {
      where: {
        id: req?.params?.id,
      },
    });
    res.status(200).json({
      error: false,
      message: "successful",
      data: result[0],
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const result = await Transaction.destroy({
      where: {
        id: req?.params?.id,
      },
    });
    res.status(200).json({
      error: false,
      message: "successful",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
