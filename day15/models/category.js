module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "category",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );
  Category.associate = (models) => {
    Category.hasMany(models.blog, {
      foreignKey: "category_id",
    });
  };
  return Category;
};
