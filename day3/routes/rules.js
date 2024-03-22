const router = require("express").Router();
const {
  getAllRules,
  getSingleRule,
  createRule,
  deleteRule,
  updateRule,
} = require("../controllers/rules");

router.get("/rules", getAllRules);
router.post("/rules", createRule);
router.get("/rules/:id", getSingleRule);
router.delete("/rules/:id", deleteRule);
router.put("/rules/:id", updateRule);

module.exports = router;
