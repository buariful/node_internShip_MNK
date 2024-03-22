const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const directors = await db.director.findAll({
      where: {},
    });

    return {
      success: true,
      message: "All directors",
      data: directors,
    };
  } catch (error) {
    return formatError(error);
  }
};
