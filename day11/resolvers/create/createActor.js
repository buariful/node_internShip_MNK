const { ApolloError, UserInputError } = require("apollo-server-express");
const { Validator } = require("node-input-validator");

module.exports = async (_, { input }, { db }) => {
  try {
    const { genre_id, actor_id } = input;

    const v = new Validator(
      { genre_id: input.genre_id, actor_id: input.actor_id },
      { genre_id: "required", actor_id: "required" }
    );

    v.check().then(function (matched) {
      if (!matched) {
        Object.keys(v.errors).forEach((error) => {
          return new UserInputError(v.errors[error].message);
        });
      }
    });

    const allGenreMovies = await db.genre_movie.findAll({
      where: {
        genre_id,
      },
    });

    if (allGenreMovies.length) {
      await Promise.all(
        allGenreMovies.map(async (genreMovie) => {
          await db.movie_actor.create({
            actor_id,
            movie_id: genreMovie.movie_id,
          });
        })
      );
    } else {
      return {
        success: false,
        message: "No movies found under the genre",
      };
    }

    return {
      success: true,
      message: "Actor added to the moveies.",
    };
  } catch (error) {
    console.log("create_actor -> error", error);
    return new ApolloError("InternalServerError");
  }
};
