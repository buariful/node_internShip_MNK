module.exports = (sequelize, DataTypes) => {
  const Movie_Actor = sequelize.define(
    "movie_actor",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      actor_id: DataTypes.INTEGER,
      movie_id: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "movie_actor",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Movie_Actor;
};
