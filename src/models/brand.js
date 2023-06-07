module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    'Brand',
    {
      brandName: {
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

  Brand.associate = db => {
    Brand.hasMany(db.Product, {
      foreignkey: {
        name: 'brandId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Brand;
};
