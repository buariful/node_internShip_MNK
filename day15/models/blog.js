module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "blog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "blog",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Blog.associate = (models) => {
    Blog.belongsTo(models.category, {
      foreignKey: "category_id",
    });
    Blog.belongsTo(models.user, {
      foreignKey: "user_id",
    });
  };

  return Blog;
};
