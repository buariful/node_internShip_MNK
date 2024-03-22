const router = require("express").Router();
const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

router.post("/order", createOrder);
router.get("/order", getAllOrder);
router.get("/order/:id", getSingleOrder);
router.put("/order/:id", updateOrder);
router.delete("/order/:id", deleteOrder);

module.exports = router;
