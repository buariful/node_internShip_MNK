const db = require("../models");
const User = db.user;

exports.getAllUsers = async (_req, res) => {
  try {
    const result = await User.findAll({});
    res.status(200).json({
      error: false,
      message: "All users",
      list: result,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const result = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Get single user",
        model: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "No users found",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({
      error: false,
      message: "User created successfully.",
      data: result?.id,
    });
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.status(200).json({
        error: false,
        message: "Deleted the user",
        data: result,
      });
    } else {
      res.status(400).json({
        error: true,
        message: "User id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const result = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (result[0]) {
      res.status(200).json({
        error: false,
        message: "User updated successfully.",
        data: result[0],
      });
    } else {
      res.status(400).json({
        error: true,
        message: "User id is wrong.",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error?.message,
    });
  }
};
