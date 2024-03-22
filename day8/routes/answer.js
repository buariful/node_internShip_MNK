const router = require("express").Router();
const db = require("../models");
const Answer = db.answer;

router
  .route("/")
  /* get all answer */
  .get(async (_req, res) => {
    try {
      const result = await Answer.findAll({});
      res.status(200).json({
        error: false,
        list: result,
      });
    } catch (error) {
      res.status(400).json({
        error: false,
        message: error?.message,
      });
    }
  })
  /* create answer */
  .post(async (req, res) => {
    try {
      const result = await Answer.create(req.body);
      res.status(201).json({
        error: false,
        data: result,
        message: "Answer created",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

router
  .route("/:id")
  /* get one answer */
  .get(async (req, res) => {
    try {
      const result = await Answer.findByPk(req.params.id);
      res.status(200).json({
        error: false,
        model: result,
        message: "Answer",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* update answer */
  .put(async (req, res) => {
    try {
      const result = await Answer.update(req.params.id, req.body);
      res.status(200).json({
        error: false,
        model: result,
        message: "Answer",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* delete answer */
  .delete(async (req, res) => {
    try {
      const result = await Answer.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        error: false,
        model: result,
        message: "Answer deleted",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;
