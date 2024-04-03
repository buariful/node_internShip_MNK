const { Sequelize } = require("sequelize");
console.log(new Date());
module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define(
    "schedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      company: DataTypes.STRING,
      phone: DataTypes.STRING,
      notes: DataTypes.STRING,
      timezone: DataTypes.STRING,
      // timezone_offset: DataTypes.STRING,
      schedule_date: DataTypes.DATEONLY,
      schedule_time: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date().toISOString(), // Use Sequelize.literal to set default value as CURRENT_DATE
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date().toISOString(), // Use Sequelize.literal to set default value as CURRENT_TIMESTAMP
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "schedule",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return schedule;
};
