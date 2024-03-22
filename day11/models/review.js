module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notes: DataTypes.STRING,
      movie_id: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "review",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.movie, {
      foreignKey: "movie_id",
    });
  };
  return Review;
};
