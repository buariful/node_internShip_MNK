const { formatError } = require("../../utils/formatError");

module.exports = async (_, { id }, { db }) => {
  try {
    const actor = await db.actor.findByPk(id);

    return {
      success: true,
      message: "Single actor",
      data: actor,
    };
  } catch (error) {
    return formatError(error);
  }
};
