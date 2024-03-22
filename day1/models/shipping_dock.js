module.exports = (sequelize, DataTypes) => {
  const ShippingDock = sequelize.define(
    "shipping_dock",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      // status: DataTypes.ENUM("0", "1"),
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
      tableName: "shipping_dock",
    },
    {
      // underscoredAll: false,
      // underscored: false,
    }
  );

  return ShippingDock;
};
