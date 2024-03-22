module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    "genre",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "genre",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Genre;
};
