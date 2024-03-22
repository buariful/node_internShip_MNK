const { formatError } = require("../../utils/formatError");

module.exports = async (_, { id }, { db }) => {
  try {
    const genre = await db.genre.findByPk(id);

    return {
      success: true,
      message: "Single genre",
      data: genre,
    };
  } catch (error) {
    return formatError(error);
  }
};
