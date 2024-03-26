var express = require("express");
const tableValidation = require("../middleware/tableValidation");
const DBQuery = require("../utils/DBQuery");
const { QueryTypes, Op } = require("sequelize");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router
  .route("/api/v1/records/:table")
  .get(tableValidation, async (req, res) => {
    try {
      const query = new DBQuery(req).buildQuery();

      const result = await req.model.findAll(query);
      res.status(200).json({
        error: false,
        message: "list",
        // query: query,
        list: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .post(tableValidation, async (req, res) => {
    try {
      const result = await req.model.create(req.body);
      res.status(201).json({
        error: false,
        message: "created",
        data: result.id,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

router
  .route("/api/v1/records/:table/:id")
  .get(tableValidation, async (req, res) => {
    try {
      const query = new DBQuery(req).buildQuery();

      const result = await req.model.findAll(query);
      res.status(200).json({
        error: false,
        message: "model",
        // query: query,
        model: result[0] || null,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .put(tableValidation, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await req.model.update(req.body, {
        where: {
          id,
        },
      });
      res.status(201).json({
        error: false,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .delete(tableValidation, async (req, res) => {
    const { id } = req.params;

    try {
      const result = await req.model.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        data: result,
        message: "deleted",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;
