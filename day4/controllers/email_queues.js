const db = require("../models");
const EmailQueue = db.email_queue;

exports.getAllEmailQueues = async (req, res) => {
  try {
    const result = await EmailQueue.findAll({});
    return res.status(200).json({
      error: false,
      message: "success",
      list: result,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};
