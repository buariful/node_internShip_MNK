module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tax: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Status must be either 0 or 1",
          },
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "order",
    },
    {
      // underscoredAll: false,
      // underscored: false,
    }
  );

  return Order;
};
