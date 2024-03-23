
    module.exports = function(express){
const router = express.Router()
router
  .route("/email")
  .get(async (req, res) => {
    try {
       const db = req.app.get('db');
      const result = await db.email.findAll({});

      return res.status(200).json({
        error: false,
        message: "email result",
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
      const result = await db.email.create(req.body);

      return res.status(200).json({
        error: false,
        message: "email result",
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
  .route("/email/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = await db.email.findByPk(id);

      return res.status(200).json({
        error: false,
        message: "email result",
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
      const result = db.email.update(req.body, {
        where: { id: id },
      });
      return res.status(200).json({
        error: false,
        message: "email result",
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
      const result = db.email.destroy({
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
