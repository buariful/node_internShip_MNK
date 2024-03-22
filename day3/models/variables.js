module.exports = (sequelize, DataTypes) => {
  const rules = sequelize.define(
    "variables",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("INTEGER", "FLOAT", "STRING"),
        allowNull: false,
      },
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "variables",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return rules;
};
