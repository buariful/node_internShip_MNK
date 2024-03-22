const express = require("express");
const {
  createShipping,
  getAllShipping,
  getSingleShipping,
  updateShipping,
  deleteShipping,
} = require("../controllers/shippingDock.controller");
const router = express.Router();

router.post("/shipping_dock", createShipping);
router.get("/shipping_dock", getAllShipping);
router.get("/shipping_dock/:id", getSingleShipping);
router.put("/shipping_dock/:id", updateShipping);
router.delete("/shipping_dock/:id", deleteShipping);

module.exports = router;
