const { formatError } = require("../../utils/formatError");

module.exports = async (_, { id }, { db }) => {
  try {
    const movie = await db.movie.findByPk(id, {
      include: [
        {
          model: db.actor,
          as: "allActors",
        },
        {
          model: db.genre,
          as: "genres",
        },
        {
          model: db.director,
          as: "directors",
        },
        {
          model: db.review,
          as: "reviews",
        },
      ],
    });

    return {
      success: true,
      message: "Single movie",
      data: movie,
    };
  } catch (error) {
    return formatError(error);
  }
};
