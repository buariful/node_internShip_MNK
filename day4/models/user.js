module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, 0]],
            msg: "Status must be either 1 or 0",
          },
        },
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "user",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );
  User.associate = (models) => {
    User.belongsToMany(models.email, {
      through: "email_queue",
      foreignKey: "user_id",
      otherKey: "email_id",
      as: "user",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  };

  return User;
};
