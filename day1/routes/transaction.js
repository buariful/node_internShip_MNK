const router = require("express").Router();
const {
  createTransaction,
  getAllTransaction,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

router.post("/transaction", createTransaction);
router.get("/transaction", getAllTransaction);
router.get("/transaction/:id", getSingleTransaction);
router.put("/transaction/:id", updateTransaction);
router.delete("/transaction/:id", deleteTransaction);

module.exports = router;
