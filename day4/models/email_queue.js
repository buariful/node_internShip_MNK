module.exports = (sequelize, DataTypes) => {
  const EmailQueue = sequelize.define(
    "email_queue",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [[1, 0]],
            msg: "Status must be either 1 or 0.",
          },
        },
      },
      created_at: DataTypes.DATEONLY,
      send_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "email_queue",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  EmailQueue.associate = (models) => {
    EmailQueue.belongsTo(models.user, { foreignKey: "user_id" });
    EmailQueue.belongsTo(models.email, { foreignKey: "email_id" });
  };
  return EmailQueue;
};
