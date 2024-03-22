const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const genres = await db.genre.findAll({
      where: {},
    });

    return {
      success: true,
      message: "All genres",
      data: genres,
    };
  } catch (error) {
    return formatError(error);
  }
};
