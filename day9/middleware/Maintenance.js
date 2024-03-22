const config = {
  //   MAINTENANCE: false,
  MAINTENANCE: true,
};

const Maintenance = (req, res, next) => {
  try {
    if (config.MAINTENANCE === true) {
      return res.status(503).json({
        error: true,
        message: "Service is currently undergoing maintenance.",
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

module.exports = Maintenance;
