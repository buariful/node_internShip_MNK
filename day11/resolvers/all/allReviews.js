const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const reviews = await db.review.findAll({
      where: {},
    });

    return {
      success: true,
      message: "All reviews",
      data: reviews,
    };
  } catch (error) {
    return formatError(error);
  }
};
