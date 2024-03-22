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
      notes: {
        type: DataTypes.STRING,
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
