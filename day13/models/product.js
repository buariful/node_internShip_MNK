module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "product",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Product;
};
