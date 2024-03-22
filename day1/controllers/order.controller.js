const db = require("../models");
const Order = db.order;

exports.createOrder = async (req, res) => {
  try {
    const result = await Order.create(req.body);

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

exports.getAllOrder = async (_req, res) => {
  try {
    const result = await Order.findAll({});
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
exports.getSingleOrder = async (req, res) => {
  try {
    const result = await Order.findOne({
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
exports.updateOrder = async (req, res) => {
  try {
    const result = await Order.update(req.body, {
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
exports.deleteOrder = async (req, res) => {
  try {
    const result = await Order.destroy({
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
