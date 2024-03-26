module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "user",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.blog, {
      foreignKey: "user_id",
    });
  };
  return User;
};
