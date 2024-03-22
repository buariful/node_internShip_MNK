var express = require("express");
const tokenValidator = require("../middleware/tokenValidator");
const JwtService = require("../services/JwtService");
const Maintenance = require("../middleware/Maintenance");
var router = express.Router();

/* GET users listing. */
router.get("/user", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/user/get-token", async (req, res) => {
  try {
    const token = JwtService.createAccessToken(req.body);
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
});

router.get("/:portal/test", Maintenance, tokenValidator, async (req, res) => {
  // router.get("/test", async (req, res) => {
  res.status(200).json({
    error: false,
    id: req.user_id,
    role: req.role,
    message: "Authorize user.",
  });
});

module.exports = router;
