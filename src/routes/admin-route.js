const express = require('express');

const router = express.Router();

// const adminAuthenticate = require('../middlewares/admin-authenticate');
const productController = require('../controllers/product-controller');
const upload = require('../middlewares/upload');

router.post('/create', upload.single('image'), productController.createProduct);
module.exports = router;
