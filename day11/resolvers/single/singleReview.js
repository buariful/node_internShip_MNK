const { formatError } = require("../../utils/formatError");

module.exports = async (_, { id }, { db }) => {
  try {
    const review = await db.review.findByPk(id);

    return {
      success: true,
      message: "Single review",
      data: review,
    };
  } catch (error) {
    return formatError(error);
  }
};
