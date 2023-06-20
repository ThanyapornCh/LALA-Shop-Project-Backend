const jwt = require('jsonwebtoken');
const { STATUS_ADMIN } = require('../config/constant');
const createError = require('../utils/create-error');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      createError('you are unauthorized', 401);
    }
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: payload.id },
      attributes: {
        exclude: ['password'],
      },
    });
    if (user.status === STATUS_ADMIN) {
      next();
    }
    createError('You are unauthorized, You are not admin', 401);
    console.log('admin');
  } catch (err) {
    console.log('error admin');
    next(err);
  }
};
