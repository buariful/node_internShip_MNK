module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      stripe_id: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "orders",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Order;
};
