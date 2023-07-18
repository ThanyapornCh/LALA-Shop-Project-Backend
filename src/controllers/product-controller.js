const fs = require('fs');
const { Product, Brand } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.createProduct = async (req, res, next) => {
  try {
    // console.log(req.file.path);
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

exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    console.log(req.file.path);
    const updateurl = await cloudinary.upload(req.file.path);
    console.log(updateurl);

    const updateValue = {
      image: updateurl,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
    };
    const updateProduct = await Product.update(
      { ...updateValue },
      { where: { id: Number(productId) } }
    );

    console.log(updateProduct);
    res
      .status(200)
      .json({
        message: 'Update product to be sucess!',
        ...updateProduct,
        productId,
      });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const deleteproduct = await Product.destroy({
      where: {
        id: Number(productId),
      },
    });
    console.log(deleteproduct);
    res.status(200).json({ message: 'Delete product to be success!' });
  } catch (err) {
    next(err);
  }
};

exports.getAllProduct = async (req, res, next) => {
  const product = await Product.findAll();
  console.log(product);
  res.status(200).json({ product });
};

exports.getAllBrand = async (req, res, next) => {
  const brand = await Brand.findAll();
  console.log(brand);
  res.status(200).json({ brand });
};
