const { User, Order } = require('../models');
const { STATUS_ME } = require('../config/constant');
const fs = require('fs');
const createError = require('../utils/create-error');
const cloudinary = require('../utils/cloudinary');

exports.getuserInfoById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId,
      },
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      createError('user with this id is not found', 400);
    }

    let statusWithAuthUser;
    if (req.user.id === +req.params.userId) {
      statusWithAuthUser = STATUS_ME;
    }
    res.status(200).json({ message: 'get usser with id' });
  } catch (err) {
    next(err);
  }
};
exports.updateProfileImage = async (req, res, next) => {
  try {
    let value;
    const { profileImage, coverImage } = req.user;
    const profilePublicId = profileImage
      ? cloudinary.getPublicId(profileImage)
      : null;
    const coverPublicId = coverImage
      ? cloudinary.getPublicId(coverImage)
      : null;
    if (!req.files.profileImage && !req.files.coverImage) {
      createError('profile image or cover image is required');
    } else if (req.files.profileImage && req.files.coverImage) {
      const [profileImage, coverImage] = await Promise.all([
        cloudinary.upload(req.files.profileImage[0].path, profilePublicId),
        cloudinary.upload(req.files.coverImage[0].path, coverPublicId),
      ]);

      value = { profileImage, coverImage };
    } else if (req.files.profileImage) {
      const profileImage = await cloudinary.upload(
        req.files.profileImage[0].path,
        profilePublicId
      );
      value = { profileImage };
    } else {
      const coverImage = await cloudinary.upload(
        req.files.coverImage[0].path,
        coverPublicId
      );
      value = { coverImage };
    }

    await User.update(value, { where: { id: req.user.id } });
    res.status(200).json(value);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlinkSync(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }
  }
};

exports.uploadSlip = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const order = await Order.findOne({
      where: {
        userId: userId,
        orderStatus: 'Cart',
      },
    });

    const url = await cloudinary.upload(req.file.path);
    // console.log(url);
    const value = { slipUrl: url, orderStatus: 'Paid' };
    // console.log(value);
    await order.update(value);
    res.status(200).json({ message: 'Upload to be success!' });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.getBill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const billOrder = await Order.findOne({
      where: {
        orderStatus: 'Paid',
        userId: userId,
      },
    });
    // console.log(billOrder);
    res
      .status(200)
      .json({ message: 'get bill order to be success', billOrder });
  } catch (err) {
    next(err);
  }
};
