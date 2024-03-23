
    module.exports = function(express){
const router = express.Router()
router
  .route("/location")
  .get(async (req, res) => {
    try {
       const db = req.app.get('db');
      const result = await db.location.findAll({});

      return res.status(200).json({
        error: false,
        message: "location result",
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
      const result = await db.location.create(req.body);

      return res.status(200).json({
        error: false,
        message: "location result",
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
  .route("/location/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = await db.location.findByPk(id);

      return res.status(200).json({
        error: false,
        message: "location result",
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
      const result = db.location.update(req.body, {
        where: { id: id },
      });
      return res.status(200).json({
        error: false,
        message: "location result",
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
      const result = db.location.destroy({
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
