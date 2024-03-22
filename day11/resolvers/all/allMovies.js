const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const movie = await db.movie.findAll({
      where: {},
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
      message: "All movies",
      data: movie,
    };
  } catch (error) {
    return formatError(error);
  }
};
