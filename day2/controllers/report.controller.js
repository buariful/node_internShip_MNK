const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const Transaction = db.transaction;
const Order = db.order;

exports.totalSale = async (req, res) => {
  try {
    const { month, year, from_date, to_date } = req.query;
    let startDate;
    let endDate;

    if (month && year) {
      startDate = new Date(year, Number(month) - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
    } else if (from_date && to_date) {
      startDate = new Date(from_date);
      endDate = new Date(to_date);
    } else {
      res.status(400).json({ error: true, message: "Date range is required." });
      return;
    }

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    const result = await Transaction.sum("amount", {
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res
      .status(200)
      .json({ error: false, message: "Total amount", data: result });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

// GET /api/v1/report/monthly?year=2022 (given the year, calculate and return sale amount per month for that year. If sale for that month 0 don't return it. Use 1 query)
exports.yearsMonthlyReports = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year)
      return res
        .status(400)
        .json({ error: true, message: "Year is required." });

    const monthlySaleAmounts = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: Sequelize.where(
        Sequelize.fn("YEAR", Sequelize.col("created_at")),
        year
      ),
      group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
      raw: true,
    });

    const result = monthlySaleAmounts.map(({ month, totalAmount }) => ({
      month: parseInt(month),
      totalAmount: Number(totalAmount) || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1 (given the year, calculate and return sale amount per month for that year by shipping_dock_id. If sale for that month 0 don't return it.Use 1 query)
exports.yearsMonthlyReports_withShippingDock = async (req, res) => {
  try {
    const { year, shipping_dock_id } = req.query;

    if (!year || !shipping_dock_id)
      return res
        .status(400)
        .json({ error: true, message: "Year is required." });

    const monthlySaleAmounts = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      // where: Sequelize.where(
      //   Sequelize.fn("YEAR", Sequelize.col("created_at")),
      //   year
      // ),
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("created_at")),
            year
          ),
          { shipping_dock_id: Number(shipping_dock_id) },
        ],
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
      raw: true,
    });

    const result = monthlySaleAmounts.map(({ month, totalAmount }) => ({
      month: parseInt(month),
      totalAmount: Number(totalAmount) || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

// GET /api/v1/report/user?year=2022&user_id=1 (given the year, calculate and return sale amount per month for that year by user_id. If sale for that month 0 don't return it. Use 1 query)
exports.yearsMonthlyReports_withUserId = async (req, res) => {
  try {
    const { year, user_id } = req.query;

    if (!year || !user_id)
      return res
        .status(400)
        .json({ error: true, message: "Year and user_id are required." });

    const monthlySaleAmounts = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("created_at")),
            year
          ),
          { user_id: Number(user_id) },
        ],
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
      raw: true,
    });

    const result = monthlySaleAmounts.map(({ month, totalAmount }) => ({
      month: parseInt(month),
      totalAmount: Number(totalAmount) || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

// GET /api/v1/report/user/count?year=2022&user_id=1 (given the year, calculate # of orders per month from that user and return # order and month. If month has 0 sale, return 0 with the month. Use 1 query)

exports.countUserOrder = async (req, res) => {
  try {
    const { year, user_id } = req.query;

    if (!year || !user_id)
      return res
        .status(400)
        .json({ error: true, message: "Year and user_id are required." });

    const monthlySaleAmounts = await Order.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("created_at")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("created_at")),
            year
          ),
          { user_id: Number(user_id) },
        ],
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("created_at"))],
      raw: true,
    });

    const result = monthlySaleAmounts.map(({ month, totalAmount }) => ({
      month: parseInt(month),
      totalAmount: Number(totalAmount) || 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
