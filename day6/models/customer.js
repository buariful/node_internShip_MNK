module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define(
    "customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shopify_customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      shopify_customer_email_verified: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, 0]],
            msg: "shopify_customer_email_verified must be either 1 or 0",
          },
        },
      },
    },
    {
      //   timestamps: true,
      //   freezeTableName: true,
      tableName: "customer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return customer;
};
