const GetPaginate = async (
  Model,
  limit = 10,
  page = 1,
  sort = "id",
  direction = "ASC",
  response
) => {
  try {
    const result = await Model.findAll({
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      order: [[sort, direction]],
    });
    const total = await Model.count();
    return { list: result, total, page: Number(page) };
  } catch (error) {
    response.status(400).json({
      error: true,
      message: error?.message,
    });
  }
};

module.exports = GetPaginate;
