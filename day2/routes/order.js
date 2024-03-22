const router = require("express").Router();
const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getOrderWithOddId,
  getOrders,
  getOrders_cursorPaginate,
} = require("../controllers/order.controller");
// ------- day 2 -----------------
router.get("/order/odd", getOrderWithOddId);
router.get("/order", getOrders);
router.get("/order/cursor", getOrders_cursorPaginate);

// ----------- day 1-----
// router.post("/order", createOrder);
// router.get("/order", getAllOrder);
// router.get("/order/:id", getSingleOrder);
// router.put("/order/:id", updateOrder);
// router.delete("/order/:id", deleteOrder);

module.exports = router;
