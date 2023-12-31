const express = require('express');

const authenticate = require('../middlewares/authenticate');
const productController = require('../controllers/product-controller');
const orderController = require('../controllers/order-controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/create', upload.single('image'), productController.createProduct);
router.put(
  '/product/update/:productId',
  upload.single('image'),
  productController.updateProduct
);

router.delete('/product/:productId', productController.deleteProduct);

router.get('/product', productController.getAllProduct);
router.get('/product/brand', productController.getAllBrand);
router.get('/orders', authenticate, orderController.getCheckOrder);

module.exports = router;
