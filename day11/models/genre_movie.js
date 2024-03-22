module.exports = (sequelize, DataTypes) => {
  const Genre_Movie = sequelize.define(
    "genre_movie",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      movie_id: DataTypes.INTEGER,
      genre_id: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "genre_movie",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Genre_Movie;
};
