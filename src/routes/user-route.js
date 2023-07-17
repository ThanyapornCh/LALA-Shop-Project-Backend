const express = require('express');

const userController = require('../controllers/user-controller');
const userUploadController = require('../controllers/user-controller');
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:userId', userController.getuserInfoById);
router.patch(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  userController.updateProfileImage
);

router.get('/:userId/bill', authenticate, userUploadController.getBill);
router.post(
  '/slip',
  authenticate,
  upload.single('slipUrl'),
  userUploadController.uploadSlip
);

module.exports = router;
