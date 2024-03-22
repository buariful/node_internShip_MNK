module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "question",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [
              [
                "short_answer",
                "multiple_choice",
                "multiple_selection_choice",
                "long_text",
                "description",
                "true_false",
              ],
            ],
            msg: "Please use preserved types",
          },
        },
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      // freezeTableName: true,
      tableName: "question",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  Question.associate = (models) => {
    Question.hasMany(models.answer, {
      foreignKey: "question_id",
    });
  };

  return Question;
};
