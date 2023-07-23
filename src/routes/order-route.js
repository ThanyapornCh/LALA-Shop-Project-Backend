const express = require('express');

const authenticate = require('../middlewares/authenticate');
const orderController = require('../controllers/order-controller');

const router = express.Router();

router.post('/:productId', authenticate, orderController.addOrder);
router.put('/:orderItemId', authenticate, orderController.updateOrder);
router.delete(
  '/:orderId/product/:productId',
  authenticate,
  orderController.deleteOrder
);

router.get('/', authenticate, orderController.getOrder);
router.get('/orderstatus', authenticate, orderController.getOrderStatus);

module.exports = router;
