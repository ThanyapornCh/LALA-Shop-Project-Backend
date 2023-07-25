const jwt = require('jsonwebtoken');
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
      where: { id: payload.id, status: payload.status },
      attributes: {
        exclude: ['password'],
      },
    });
    const admin = await User.findOne({
      where: { id: payload.id, status: payload.status },
      attributes: {
        exclude: ['password'],
      },
    });
    console.log(payload.status);

    console.log(user.status);

    if (user) {
      if (user.status === 'user') {
        req.user = user;
        next();
      } else if (user.status === 'admin') {
        req.user = admin;
        next();
      }
    } else {
      createError('you are unauthorized', 400);
    }
    // if (!user) {
    //   createError('you are unauthorized', 400);
    // }
    // req.user = user;
    // next();
  } catch (err) {
    next(err);
  }
};
