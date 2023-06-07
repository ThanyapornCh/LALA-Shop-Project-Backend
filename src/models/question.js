module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      dataPersonal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      questionType: {
        type: DataTypes.ENUM('checkSkinType', 'skinCareProduct'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );

  Question.associate = db => {
    Question.hasMany(db.Answer, {
      foreignKey: {
        name: 'questionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Question;
};
