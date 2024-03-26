const tableValidation = async (req, res, next) => {
  try {
    const { table } = req.params;
    const db = req.app.get("db");
    const Model = db[table];
    if (!Model) {
      return res.status(400).json({
        message: "table not found",
      });
    }
    req.model = Model;
    return next();
  } catch (error) {
    console.log("tableValidation", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = tableValidation;
