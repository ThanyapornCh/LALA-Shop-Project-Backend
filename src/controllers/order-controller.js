const createError = require('../utils/create-error');
const { Order, Product, OrderItem } = require('../models');

exports.addOrder = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const response = await Product.findOne({
      where: {
        id: Number(productId),
      },
    });
    const product = JSON.parse(JSON.stringify(response));

    const order = await Order.findOne({
      where: {
        orderStatus: 'Cart',
        userId: req.user.id,
      },
    });
    //ถ้า ไม่มี order ให้order status เป็น 'cart' ในslip_url เป็น Empty
    if (!order) {
      const newOrder = await Order.create({
        orderStatus: 'Cart',
        userId: req.user.id,
        totalPrice: product.price,
        slipUrl: 'Empty',
      });
      const runOrder = JSON.parse(JSON.stringify(newOrder));
      console.log(runOrder);
      await OrderItem.create({
        price: product.price,
        quantity: 1,
        orderId: runOrder.id,
        productId: product.id,
      });
      const orders = await Order.findOne({
        where: {
          id: runOrder.id,
        },
        include: {
          model: OrderItem,
          include: {
            model: Product,
          },
        },
      });
      return res.json(orders);
    } else {
      //ถ้าuser กดสั่งซื้อเข้าตะกร้า item1 แล้วกด add อีกตัวเป็นสินค้าต่างกัน เข้า Cart คือ item2
      const isItem = await OrderItem.findOne({
        where: {
          orderId: order.id,
          productId: product.id,
        },
      });
      //เพิ่มสินค้า
      if (isItem) {
        await OrderItem.increment(
          {
            quantity: 1,
          },
          {
            where: {
              id: isItem.id,
            },
          }
        );
      } else {
        //ถ้ายังไม่มีในตะกร้าสินค้า
        await OrderItem.create({
          price: product.price,
          quantity: 1,
          orderId: order.id,
          productId: product.id,
        });
      }
    }

    const findOrder = await Order.findOne({
      where: {
        id: order.id,
      },
      include: {
        model: OrderItem,
        include: {
          model: Product,
        },
      },
    });
    return res.json(findOrder);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  const { orderItemId } = req.params;
  const { method } = req.body;
  const orderItems = await OrderItem.findOne({
    where: {
      id: Number(orderItemId),
    },
  });
  // ถ้ามีการ add เข้าตะกร้า ให้เพิ่มจำนวนในตะกร้าเป็น 1 ชิ้น
  if (method === 'add') {
    await OrderItem.increment(
      {
        quantity: 1,
      },
      {
        where: {
          id: Number(orderItemId),
        },
      }
    );
    //ถ้า จำนวนมีมากกว่า 0 ให้จำนวนใน orderItem ลดลงไป 1 จำนวน
  } else if (method === 'minus' && orderItems.quantity > 0) {
    await OrderItem.decrement(
      {
        quantity: 1,
      },
      {
        where: {
          id: Number(orderItemId),
        },
      }
    );
  }
  const unpaid = await Order.findOne({
    where: {
      userId: req.user.id,
      orderStatus: 'Cart',
    },
    include: {
      model: OrderItem,
      include: {
        model: Product,
      },
    },
  });
  res.status(200).json({ order: unpaid });
  //ถ้า add to cart ในorderนึงมีสินค้าหลายจำนวน ต้องรู้ราคาสินค้ารวมทั้งหมด
  //   const upstatus = await OrderItem.findAll({
  //     where:{
  //         quantity: Number(count),
  //         userId: req.user.id,
  //     }
  //   })
};

exports.deleteOrder = async (req, res, next) => {
  const { orderId, productId } = req.params;
  try {
    const totalDelete = await OrderItem.destroy({
      where: {
        productId: +productId,
        orderId: +orderId,
      },
    });
    console.log(totalDelete);
    if (totalDelete === 0) {
      createError('Your cart is empty!');
    }
    res.status(200).json({ message: 'Delete order to be successfully!' });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  const orders = await Order.findOne({
    where: {
      userId: req.user.id,
      orderStatus: 'Cart',
    },
    include: {
      model: OrderItem,
      include: {
        model: Product,
      },
    },
  });
  res.status(200).json({ orders });
};
