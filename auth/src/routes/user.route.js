const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller');
const userController = require('./../controllers/user.controller');
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require('./../validations/auth.validation');

const { uploadImage } = require('./../middlewares/multer');
const { uploadImageCloud } = require('./../middlewares/cloudinary');

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

router.get('/verify-token/:token', authController.authenticate);
router.patch(
  '/update-user',
  authController.authenticateAuth,
  userController.updateUser
);
router.patch(
  '/upload-avatar',
  authController.authenticateAuth,
  uploadImage.single('avatar'),
  uploadImageCloud,
  userController.uploadAvatar
);

//-----------------------------------------------------------------------
router.post(
  '/forgotpassword',
  validateForgotPassword,
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:resetToken',
  validateResetPassword,
  authController.resetPassword
);

router.get(
  '/get-user-myself',
  authController.authenticate,
  userController.getUserByMyself
);

module.exports = router;
