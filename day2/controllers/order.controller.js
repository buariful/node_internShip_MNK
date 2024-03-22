const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const GetPaginate = require("../services/GetPaginate");
const Order = db.order;

// ------------ day 1 ---------------
// exports.createOrder = async (req, res) => {
//   try {
//     const result = await Order.create(req.body);

//     res.status(201).json({
//       error: false,
//       message: "Shipping successful",
//       data: result?.id,
//     });
//   } catch (error) {
//     res.status(400).json({ error: true, message: error?.message });
//   }
//   // .then((shippingDock) => {
//   //   res.status(201).json(shippingDock);
//   // })
//   // .catch((error) => {
//   //   res.status(400).json({ error: error.message });
//   // });
// };
// exports.getAllOrder = async (_req, res) => {
//   try {
//     const result = await Order.findAll({});
//     res.status(200).json({
//       error: false,
//       message: "successful",
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: true,
//       message: error?.message,
//     });
//   }
// };
// exports.getSingleOrder = async (req, res) => {
//   try {
//     const result = await Order.findOne({
//       where: {
//         id: req?.params?.id,
//       },
//     });
//     res.status(200).json({
//       error: false,
//       message: "successful",
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: true,
//       message: error?.message,
//     });
//   }
// };
// exports.updateOrder = async (req, res) => {
//   try {
//     const result = await Order.update(req.body, {
//       where: {
//         id: req?.params?.id,
//       },
//     });
//     res.status(200).json({
//       error: false,
//       message: "successful",
//       data: result[0],
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: true,
//       message: error?.message,
//     });
//   }
// };
// exports.deleteOrder = async (req, res) => {
//   try {
//     const result = await Order.destroy({
//       where: {
//         id: req?.params?.id,
//       },
//     });
//     res.status(200).json({
//       error: false,
//       message: "successful",
//       data: result,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: true,
//       message: error?.message,
//     });
//   }
// };

// ------------ day 2 ------------
exports.getOrderWithOddId = async (_req, res) => {
  try {
    const result = await Order.findAll({
      where: {
        id: {
          [Op.and]: [Sequelize.where(Sequelize.literal("id % 2"), "=", 1)],
        },
      },
    });
    res
      .status(200)
      .json({ error: false, message: "Order with odd id's", list: result });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const { limit, page, sort, direction } = req.query;

    const total = await Order.count();
    const result = await GetPaginate(Order, limit, page, sort, direction, res);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

// GET /api/v1/order/cursor?id=20&limit=10
// (paginate the orders using cursor method. So if id = 20, then you return 10 rows that are greater than id 20. Response format:
// {
//   id: 20
//   list: []
// })
exports.getOrders_cursorPaginate = async (req, res) => {
  // id=20&limit=10
  try {
    const { limit, id } = req.query;
    if (!limit || !id) {
      return res.status(400).json({
        error: true,
        message: "Id and limit not found",
      });
    }

    const result = await Order.findAll({
      where: {
        id: { [Op.gt]: id },
      },
      limit: Number(limit),
    });

    return res.status(200).json({
      error: false,
      message: "Orders with cursor pagination.",
      list: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
