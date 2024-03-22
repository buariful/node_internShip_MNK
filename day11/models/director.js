module.exports = (sequelize, DataTypes) => {
  const Director = sequelize.define(
    "director",
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
      tableName: "director",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Director.associate = (models) => {
    Director.hasMany(models.movie, {
      foreignKey: "director_id",
      as: "movies",
    });
  };
  return Director;
};
