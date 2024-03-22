module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define(
    "actor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "actor",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Actor.associate = (models) => {
    Actor.belongsToMany(models.movie, {
      through: "movie_actor",
      foreignKey: "actor_id",
      otherKey: "movie_id",
    });
  };

  return Actor;
};
