const db = require("../models");
const Email = db.email;

exports.getAllEmails = async (_req, res) => {
  try {
    const result = await Email.findAll({});
    res.status(200).json({
      error: false,
      message: "All emails",
      list: result,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.getSingleEmail = async (req, res) => {
  try {
    const result = await Email.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Get single email",
        model: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "No emails found",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.createEmail = async (req, res) => {
  try {
    const result = await Email.create(req.body);
    res.status(201).json({
      error: false,
      message: "Email created successfully.",
      data: result?.id,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.deleteEmail = async (req, res) => {
  try {
    const result = await Email.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Deleted the email",
        data: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Email id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const result = await Email.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (result[0]) {
      res.status(200).json({
        error: false,
        message: "Email updated successfully.",
        data: result[0],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "Email id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};
