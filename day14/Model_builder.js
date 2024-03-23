let fs = require("fs");
const path = require("path");

/* 
1. read the configuration file and parse it.
2. check if the releas and releas/model folder exists, otherwise create.
3. traverse the configuration file and create models under the model folder.
*/

function Model_builder() {
  // let config = fs.readFileSync('configuration.json');
  this.config = null;
  this.build = function () {
    //generate files and put it into release folder
    //Copy initialize files into release folder
    //TODO
    try {
      const configFile = path.join(__dirname, "configuration.json");
      this.config = JSON.parse(fs.readFileSync(configFile, "utf8"));

      const releaseFolder = path.join(__dirname, "release");
      if (!fs.existsSync(releaseFolder)) {
        fs.mkdirSync(releaseFolder);
      }

      const modelFolder = path.join(__dirname, "release/model");
      if (!fs.existsSync(modelFolder)) {
        fs.mkdirSync(modelFolder);
      }
      console.log(`----------models----------`);
      for (const model of this.config.model) {
        const modelName = model.name;
        const modelFields = model.field;
        const modelFilePath = path.join(modelFolder, `${modelName}.js`);

        // Creating the  model files
        fs.writeFileSync(
          modelFilePath,
          generateModelContent(modelName, modelFields)
        );
        console.log(`Created model file for ${modelName}`);
      }
    } catch (error) {
      console.error("Error building models:", error);
    }
  };

  function generateModelContent(modelName, fields) {
    let modelContent = `
        module.exports = (sequelize, DataTypes) => {
            const ${modelName} = sequelize.define('${modelName}', {`;

    for (const field of fields) {
      const [fieldName, fieldType, fieldDescription, fieldRequired] = field;

      modelContent += `
                ${fieldName}: {
                  ${
                    fieldName === "id"
                      ? `primaryKey: true, autoIncrement:true,`
                      : ""
                  }
                    type: DataTypes.${fieldType.toUpperCase()},
                    allowNull: ${fieldRequired !== "required"},
                    description: '${fieldDescription}'
                },`;
    }

    // Add closing braces and return the model
    modelContent += `
            });
            return ${modelName};
        };`;

    return modelContent;
  }

  return this;
}

module.exports = Model_builder;
