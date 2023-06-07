module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );

  Category.associate = db => {
    Category.hasMany(db.Product, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Category;
};
