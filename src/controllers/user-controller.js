const { User } = require('../models');
const { STATUS_ME } = require('../config/constant');
const createError = require('../utils/create-error');

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
  } catch (err) {
    next(err);
  }
};
exports.updateProfileImage = (req, res, next) => {
  try {
    console.log(req.files);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};
