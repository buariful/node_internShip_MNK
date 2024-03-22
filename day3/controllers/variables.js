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
    function castVariable(value, type) {
      switch (type) {
        case "INTEGER":
          return parseInt(value, 10);
        case "FLOAT":
          return parseFloat(value);
        case "STRING":
          return String(value);
        default:
          return value;
      }
    }

    function evaluateCondition(variables, condition) {
      return true;
    }
    const encodedVariable = req.query.variable;
    if (!encodedVariable) {
      return res.status(400).json({ error: "Variable is missing" });
    }

    const decodedVariable = JSON.parse(base64url.decode(encodedVariable));

    const rules = await Rules.findAll();
    const evaluationResults = [];

    for (const rule of rules) {
      const ruleVariables = JSON.parse(rule.condition);
      const substitutedVariables = {};

      // Substitute variables in the rule condition
      for (const [variableName, variableValue] of Object.entries(
        ruleVariables
      )) {
        if (decodedVariable.hasOwnProperty(variableName)) {
          substitutedVariables[variableName] = decodedVariable[variableName];
        }
      }

      // Query the database to get the variable types
      const variableTypes = await Variables.findAll({
        attributes: ["name", "type"],
        where: {
          name: {
            [Op.in]: Object.keys(substitutedVariables),
          },
        },
      });

      // Cast variables to match the database version
      for (const variableType of variableTypes) {
        substitutedVariables[variableType.name] = castVariable(
          substitutedVariables[variableType.name],
          variableType.type
        );
      }

      // Evaluate the rule condition
      const isRuleSatisfied = evaluateCondition(
        substitutedVariables,
        rule.condition
      );

      // If rule condition is true, add to the result
      if (isRuleSatisfied) {
        evaluationResults.push({
          rule_id: rule.id,
          result: rule.action,
        });
      }
    }

    res.status(200).json(evaluationResults);
  } catch (error) {
    console.error("Error:", error);
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
