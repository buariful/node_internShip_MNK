const { formatError } = require("../../utils/formatError");

module.exports = async (_, __, { db }, info) => {
  try {
    const actors = await db.actor.findAll({
      where: {},
    });

    return {
      success: true,
      message: "All actors",
      data: actors,
    };
  } catch (error) {
    return formatError(error);
  }
};
