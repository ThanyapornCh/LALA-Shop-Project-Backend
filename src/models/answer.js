module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    'Answer',
    {
      answer: {
        type: DataTypes.STRING,
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

  Answer.associate = db => {
    Answer.belongsTo(db.Question, {
      foreignKey: {
        name: 'questionId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Answer.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Answer;
};
