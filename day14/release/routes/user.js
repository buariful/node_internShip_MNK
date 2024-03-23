
    module.exports = function(express){
const router = express.Router()
router
  .route("/user")
  .get(async (req, res) => {
    try {
       const db = req.app.get('db');
      const result = await db.user.findAll({});

      return res.status(200).json({
        error: false,
        message: "user result",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
       const db = req.app.get('db');
      const result = await db.user.create(req.body);

      return res.status(200).json({
        error: false,
        message: "user result",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });

router
  .route("/user/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = await db.user.findByPk(id);

      return res.status(200).json({
        error: false,
        message: "user result",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = db.user.update(req.body, {
        where: { id: id },
      });
      return res.status(200).json({
        error: false,
        message: "user result",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = db.user.destroy({
        where: { id: id },
      });
      res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: error?.message,
      });
    }
  });
return router;
}
