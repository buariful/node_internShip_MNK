const {
  totalSale,
  yearsMonthlyReports,
  yearsMonthlyReports_withShippingDock,
  yearsMonthlyReports_withUserId,
  countUserOrder,
} = require("../controllers/report.controller");

const router = require("express").Router();

router.get("/report/sale", totalSale);
router.get("/report/monthly", yearsMonthlyReports);
router.get("/report/shipping_dock", yearsMonthlyReports_withShippingDock);
router.get("/report/user", yearsMonthlyReports_withUserId);
router.get("/report/user/count", countUserOrder);

module.exports = router;
