"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Sequelize File
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const fs = require("fs");
const path = require("path");
let Sequelize = require("sequelize");
const basename = path.basename(__filename);
const { DataTypes } = require("sequelize");
const config = {
  DB_DATABASE: "mysql",
  DB_USERNAME: "root",
  DB_PASSWORD: "9148",
  DB_ADAPTER: "mysql",
  DB_NAME: "day_1",
  // DB_NAME: "day1",
  DB_HOSTNAME: "localhost",
  DB_PORT: 3306,
};

let db = {};

let sequelize = new Sequelize(
  // config.DB_DATABASE,
  config.DB_NAME,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    // let sequelize = new Sequelize("day1", "root", "9148", {
    dialect: config.DB_ADAPTER,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT,
    // logging: console.log,
    logging: false,
    timezone: "-04:00",
    pool: {
      maxConnections: 1,
      minConnections: 0,
      maxIdleTime: 100,
    },
    define: {
      timestamps: false,
      underscoredAll: true,
      underscored: true,
    },
  }
);
//   sequelize.sync({ force: true });

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
} catch (error) {
  console.log(error?.message);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.sequelize.sync({ force: false });

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronization successful.");
  })
  .catch((error) => {
    console.error("Error during database synchronization:", error?.message);
  });

module.exports = db;
