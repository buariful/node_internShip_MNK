const { Op } = require("sequelize");
const db = require("../models");
const Rules = db.rules;

exports.getAllRules = async (_req, res) => {
  try {
    const result = await Rules.findAll({});
    res.status(200).json({
      error: false,
      message: "All rules",
      list: result,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.getSingleRule = async (req, res) => {
  try {
    const result = await Rules.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Get single rule",
        model: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "No rules found",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.createRule = async (req, res) => {
  try {
    const result = await Rules.create(req.body);
    res.status(201).json({
      error: false,
      message: "Rule created successfully.",
      data: result?.id,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const result = await Rules.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Delete single rule",
        data: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Rule id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const result = await Rules.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (result[0]) {
      res.status(200).json({
        error: false,
        message: "Rule updated successfully.",
        data: result[0],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Rule id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};
