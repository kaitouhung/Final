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

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
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
