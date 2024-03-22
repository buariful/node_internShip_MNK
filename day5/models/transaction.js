// id
// - order_id
// - user_id
// - shipping_dock_id
// - amount
// - discount
// - tax
// - total
// - notes
// - status

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shipping_dock_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount: DataTypes.INTEGER,
      tax: DataTypes.INTEGER,
      total: DataTypes.INTEGER,

      notes: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: {
            args: [[1, 0]],
            msg: "Status must be either 1 or 0.",
          },
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "transaction",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );
  return Transaction;
};
