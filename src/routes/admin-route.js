const express = require('express');

const router = express.Router();

// const adminAuthenticate = require('../middlewares/admin-authenticate');
const productController = require('../controllers/product-controller');
const upload = require('../middlewares/upload');

router.post('/create', upload.single('image'), productController.createProduct);
router.patch(
  '/product/update',
  upload.single('image'),
  productController.updateProduct
);

router.delete('/product/:productId', productController.deleteProduct);

router.get('/product', productController.getAllProduct);
router.get('/product/brand', productController.getAllBrand);

module.exports = router;
