module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      orderStatus: {
        type: DataTypes.ENUM('cart', 'paid'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      slipUrl: {
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
  Order.associate = db => {
    Order.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNul: false,
      },
      onDelete: 'RESTRICT',
    });
    Order.hasMany(db.OrderItem, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Order;
};
