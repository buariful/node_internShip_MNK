const { formatError } = require("../../utils/formatError");

module.exports = async (_, { id }, { db }) => {
  try {
    const director = await db.director.findByPk(id);

    return {
      success: true,
      message: "Single director",
      data: director,
    };
  } catch (error) {
    return formatError(error);
  }
};
