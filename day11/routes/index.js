const router = require("express").Router();
const db = require("../models");

router
  .route("/records/:table")
  .get(async (req, res) => {
    try {
      const { table } = req.params;
      const Model = db[table];
      if (!Model) {
        return res.status(400).json({
          message: "table not found",
        });
      }

      const result = await Model.findAll({
        where: {},
        // include: [{ model: db.actor, as: "allActors" }],
      });
      res.status(200).json({
        error: false,
        table,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { table } = req.params;
      const Model = db[table];
      if (!Model) {
        return res.status(400).json({
          message: "table not found",
        });
      }

      const result = await Model.create(req.body);
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
  });
router
  .route("/records/:table/:id")
  .get(async (req, res) => {
    try {
      const { table, id } = req.params;
      const Model = db[table];
      if (!Model) {
        return res.status(400).json({
          message: "table not found",
        });
      }

      const result = await Model.findOne({
        where: { id: id },
      });
      res.status(200).json({
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
  .put(async (req, res) => {
    try {
      const { table, id } = req.params;
      const Model = db[table];
      if (!Model) {
        return res.status(400).json({
          message: "table not found",
        });
      }

      const result = await Model.update(req.body, {
        where: { id: id },
      });
      res.status(200).json({
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
  .delete(async (req, res) => {
    try {
      const { table, id } = req.params;
      const Model = db[table];
      if (!Model) {
        return res.status(400).json({
          message: "table not found",
        });
      }

      const result = await Model.destroy({
        where: { id: id },
      });
      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

router.route("/records/:table/delete/all").delete(async (req, res) => {
  try {
    const { table } = req.params;
    const Model = db[table];
    if (!Model) {
      return res.status(400).json({
        message: "table not found",
      });
    }

    const result = await Model.destroy({
      where: {},
    });
    res.status(200).json({
      error: false,
      data: result,
      message: "All data deleted",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
});

router.route("/test").get(async (req, res) => {
  try {
    const sqlQuery = `SELECT 
    movie.*, 
    (SELECT JSON_OBJECT('id', id, 'name', name) FROM director WHERE director.id = movie.director_id) AS director,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'notes', notes)) FROM review WHERE review.movie_id = movie.id) AS review,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', actor.id, 'name', actor.name)) FROM movie_actor INNER JOIN actor ON movie_actor.actor_id = actor.id WHERE movie_actor.movie_id = movie.id) AS actors,
    (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', genre.id, 'name', genre.name)) FROM genre_movie INNER JOIN genre ON genre_movie.genre_id = genre.id WHERE genre_movie.movie_id = movie.id) AS genre
FROM 
    movie;`;
    const movies = await db.sequelize.query(sqlQuery, {
      type: db.sequelize.QueryTypes.SELECT,
    });
    return res.status(200).json({
      error: true,
      message: "asce",
      data: movies,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
});

module.exports = router;
