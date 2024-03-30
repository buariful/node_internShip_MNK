// - id
// - slug (unique)
// - subject
// - body
// - status ENUM(active, inactive) (integer mapping)

module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    "email",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "email",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Email.associate = (models) => {
    Email.hasMany(models.email_queue, {
      foreignKey: "email_id",
    });
  };

  return Email;
};
