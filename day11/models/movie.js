const { intersection } = require("lodash");
const coreModel = require("../core/models");

module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    "movie",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      director_id: DataTypes.INTEGER,
      main_genre: DataTypes.STRING,
      status: DataTypes.INTEGER,
      review: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "movie",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Movie.associate = (models) => {
    Movie.belongsTo(models.director, {
      foreignKey: "director_id",
      as: "directors",
    });

    Movie.hasMany(models.review, {
      foreignKey: "movie_id",
      as: "reviews",
    });

    Movie.belongsToMany(models.actor, {
      through: "movie_actor",
      foreignKey: "movie_id",
      otherKey: "actor_id",
      as: "allActors",
    });

    Movie.belongsToMany(models.genre, {
      through: "genre_movie",
      foreignKey: "movie_id",
      otherKey: "genre_id",
      as: "genres",
    });
  };

  Movie.intersection = function (fields) {
    if (fields) {
      return intersection(
        [
          "id",
          "title",
          "directorId",
          "status",
          "created_at",
          "review",
          "updated_at",
          "mainGenre",
        ],
        Object.keys(fields)
      );
    } else return [];
  };
  return Movie;
};
