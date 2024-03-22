const router = require("express").Router();
const db = require("../models");
const Question = db.question;
const Answer = db.answer;

router
  .route("/")
  /* get all questions */
  .get(async (_req, res) => {
    try {
      const result = await Question.findAll({ include: Answer });
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
  /* create question */
  .post(async (req, res) => {
    try {
      const result = await Question.create(req.body);
      res.status(201).json({
        error: false,
        data: result?.id,
        message: "Question created",
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
  /* get one question */
  .get(async (req, res) => {
    try {
      const result = await Question.findByPk(req.params.id);
      res.status(200).json({
        error: false,
        model: result,
        message: "Question",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* update question */
  .put(async (req, res) => {
    try {
      const result = await Question.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        error: false,
        model: result,
        message: "Question",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  /* delete question */
  .delete(async (req, res) => {
    try {
      const result = await Question.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        error: false,
        data: result,
        message: "Question deleted",
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

module.exports = router;
