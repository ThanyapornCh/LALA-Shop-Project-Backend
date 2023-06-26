const fs = require('fs');
const { Product } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.createProduct = async (req, res, next) => {
  try {
    console.log(req.file.path);
    const url = await cloudinary.upload(req.file.path);
    console.log(url);
    const value = {
      brandId: req.body.brandId,
      categoryId: req.body.categoryId,
      image: url,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };

    const product = await Product.create(value);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
