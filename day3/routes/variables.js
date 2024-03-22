const {
  getAllVariables,
  createVariable,
  getSingleVariable,
  deleteVariable,
  updateVariable,
  test,
  evaluate,
  encode,
  decode,
} = require("../controllers/variables");

const router = require("express").Router();

router.get("/variables", getAllVariables);
router.post("/variables", createVariable);
router.get("/variables/:id", getSingleVariable);
router.delete("/variables/:id", deleteVariable);
router.put("/variables/:id", updateVariable);
router.get("/evaluation", evaluate);

router.post("/encode", encode);
router.post("/decode", decode);
module.exports = router;
