const { default: base64url } = require("base64url");
const db = require("../models");
const { Op } = require("sequelize");
const Variables = db.variables;
const Rules = db.rules;

exports.getAllVariables = async (_req, res) => {
  try {
    const result = await Variables.findAll({});
    res.status(200).json({
      error: false,
      message: "All Variables",
      list: result,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.getSingleVariable = async (req, res) => {
  try {
    const result = await Variables.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Get single variable",
        model: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "No variables found",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.createVariable = async (req, res) => {
  try {
    const result = await Variables.create(req.body);
    res.status(201).json({
      error: false,
      message: "Variable created successfully.",
      data: result?.id,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.deleteVariable = async (req, res) => {
  try {
    const result = await Variables.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Delete single variable",
        data: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Variable id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.updateVariable = async (req, res) => {
  try {
    const result = await Variables.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (result[0]) {
      res.status(200).json({
        error: false,
        message: "Variable updated successfully.",
        data: result[0],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Variable id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.evaluate = async (req, res) => {
  try {
    const variablePayload = JSON.parse(base64url.decode(req.query.variable));

    // Query all rules
    const rules = await Rules.findAll();

    let formatedObj = {};
    for (const [key, value] of Object.entries(variablePayload)) {
      const variable = await Variables.findOne({ where: { name: key } });
      if (variable) {
        // Cast variable value to match the database type
        let castValue;
        switch (variable.type) {
          case "INTEGER":
            castValue = parseInt(value);
            break;
          case "FLOAT":
            castValue = parseFloat(value);
            break;
          default:
            castValue = value.toString();
        }

        formatedObj[key] = castValue;
      }
    }

    // Evaluate rules
    const evaluationResults = [];
    for (const rule of rules) {
      let condition = rule.condition;

      for (const [key, value] of Object.entries(variablePayload)) {
        console.log(typeof value);
        if (typeof value === "string") {
          condition = condition.replace(
            new RegExp(`\\b${key}\\b`, "g"),
            `'${value}'`
          );
        } else {
          condition = condition.replace(new RegExp(`\\b${key}\\b`, "g"), value);
        }
      }
      console.log(condition);
      // Evaluate condition
      if (eval(condition)) {
        evaluationResults.push({ rule_id: rule.id, result: rule.action });
      }
    }

    res.json(evaluationResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.encode = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "api body missing" });
  try {
    const encodedData = base64url(JSON.stringify(req.body));
    res.json({
      encode: encodedData,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
exports.decode = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "api body missing" });
  try {
    const decodedData = JSON.parse(base64url.decode(req?.body));
    res.json({
      decode: decodedData,
    });
  } catch (error) {
    console.log(error?.message);
  }
};
