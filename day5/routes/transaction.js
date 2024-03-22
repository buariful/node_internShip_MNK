const router = require("express").Router();
const multer = require("multer");
const {
  createByImporting,
  getAllTransactions,
  exportCsv,
} = require("../controllers/transactions");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/import")
  .post(upload.single("file"), createByImporting)
  .get(getAllTransactions);

router.route("/export").post(exportCsv);

module.exports = router;
