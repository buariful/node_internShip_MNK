const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const movie_actor = await db.movie_actor.findAll({
      where: {},
    });

    return {
      success: true,
      message: "All movie_actor",
      data: movie_actor,
    };
  } catch (error) {
    return formatError(error);
  }
};
