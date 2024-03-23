const fs = require("fs");
const path = require("path");

function Controller_builder() {
  this.config = null;
  this.build = function () {
    try {
      const configFile = path.join(__dirname, "configuration.json");
      this.config = JSON.parse(fs.readFileSync(configFile, "utf8"));

      const releaseFolder = path.join(__dirname, "release");
      if (!fs.existsSync(releaseFolder)) {
        fs.mkdirSync(releaseFolder);
      }

      const routeFolder = path.join(__dirname, "release/routes");
      if (!fs.existsSync(routeFolder)) {
        fs.mkdirSync(routeFolder);
      }
      console.log(`----------routes----------`);
      for (const model of this.config.model) {
        const modelName = model.name;
        const modelFields = model.field;
        const routeFilePath = path.join(routeFolder, `${modelName}.js`);

        // Creating the  route files
        fs.writeFileSync(
          routeFilePath,
          generateRouteContent(modelName, modelFields)
        );
        console.log(`Created route file for ${modelName}`);
      }
    } catch (error) {
      console.error("Error building route:", error);
    }
  };

  function generateRouteContent(modelName) {
    let routeContent = `
    module.exports = function(express){
const router = express.Router()
router
  .route("/${modelName}")
  .get(async (req, res) => {
    try {
       const db = req.app.get('db');
      const result = await db.${modelName}.findAll({});

      return res.status(200).json({
        error: false,
        message: "${modelName} result",
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
      const result = await db.${modelName}.create(req.body);

      return res.status(200).json({
        error: false,
        message: "${modelName} result",
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
  .route("/${modelName}/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
       const db = req.app.get('db');
      const result = await db.${modelName}.findByPk(id);

      return res.status(200).json({
        error: false,
        message: "${modelName} result",
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
      const result = db.${modelName}.update(req.body, {
        where: { id: id },
      });
      return res.status(200).json({
        error: false,
        message: "${modelName} result",
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
      const result = db.${modelName}.destroy({
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
`;

    return routeContent;
  }

  return this;
}

module.exports = Controller_builder;

/* 
router.route("/").get( async (req, res) => {
    try {
      const { product_id, total } = req.query;
      const product = await db.product.findByPk(product_id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      res.render("thankyou", { product, total });
    } catch (error) {
      console.error("Error fetching product for thank you page:", error);
      res.status(500).send("Error fetching product for thank you page");
    }
  });
*/
