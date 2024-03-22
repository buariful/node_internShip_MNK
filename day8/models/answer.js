module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "answer",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_id: DataTypes.INTEGER,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      // timestamps: true,
      // freezeTableName: true,
      tableName: "answer",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Answer.associate = (models) => {
    Answer.belongsTo(models.question, { foreignKey: "question_id" }); // models."xyz", sequelize e j name dei seta hobe. sequelize.define("xyz")
  };

  return Answer;
};
