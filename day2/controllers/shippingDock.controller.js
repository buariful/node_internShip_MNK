const db = require("../models");
// const ShippingDock = db.shippingDock;
const ShippingDock = db.shipping_dock;

exports.createShipping = async (req, res) => {
  ShippingDock.create(req.body)
    .then((shippingDock) => {
      res.status(201).json(shippingDock);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.getAllShipping = async (_req, res) => {
  try {
    const result = await ShippingDock.findAll({});
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
exports.getSingleShipping = async (req, res) => {
  try {
    const result = await ShippingDock.findOne({
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
exports.updateShipping = async (req, res) => {
  try {
    const result = await ShippingDock.update(req.body, {
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
exports.deleteShipping = async (req, res) => {
  try {
    const result = await ShippingDock.destroy({
      where: {
        id: req?.params?.id,
      },
    });
    res.status(200).json({
      error: false,
      message: "successful",
      //   data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
