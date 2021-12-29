const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');
const mailService = require('../services/email/email');
const AppError = require('./../utils/appError');
const { createHash } = require('crypto');
require('dotenv').config();

const { signupEvent } = require('./../kafka/auth.producer');

// token generate sync
const createToken = (userPayload) => {
  const token = jwt.sign(
    {
      id: userPayload._id,
      email: userPayload.email,
      role: userPayload.role,
    },
    process.env.TOKEN,
    { expiresIn: 7 * 60 * 60 }
  );

  return `Bearer ${token}`;
};

const signup = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, fullName } = req.body;

    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return next(new AppError('Email is exsits', 403));
    }

    const user = await new User({
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      fullName: fullName,
    }).save();
    user.password = undefined;

    const token = createToken(user);

    // await mailService.sendMailToUser(
    //   user.email,
    //   'Register Success',
    //   'Thank you for registering. Visit my website.'
    // );

    signupEvent(user);

    return res.status(201).json({
      status: 'Register Success',
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// hash, compare password sync
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password, user.password)) {
      return next(new AppError('Incorrect email or password', 400));
    }

    user.password = undefined;
    const token = createToken(user);

    return res.status(200).json({
      status: 'Login Success',
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  let user = null;
  try {
    const { email } = req.body;
    user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Email is invalid', 400));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${process.env.BASE_URL}/api/v1/users/resetPassword/${resetToken}`;
    await mailService.sendMailToUser(
      user.email,
      'Reset Password',
      'This is email forgot password! Click to Reset Password',
      resetURL
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Reset token is sent to Email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(new AppError('ForgotPassword fail'), 500);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Reset Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    user.password = undefined;

    const token = createToken(user);

    return res.status(200).json({
      status: 'Success',
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const authenticate = async (req, res, next) => {
  try {
    // ignore Bearer
    const token = req.header('authorization').split(' ')[1];

    if (!token) {
      return next(new AppError('You are not logged in!', 401));
    }

    // sync
    const decoded = jwt.verify(token, process.env.TOKEN);

    if (!decoded) {
      return next(new AppError('Token is invalid', 401));
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const authenticateKafka = (tokenService) => {
  try {
    const token = tokenService.split(' ')[1];

    if (!token) {
      return {
        status: 'error',
        message: 'You are not logged in!',
      };
    }

    // sync
    const decoded = jwt.verify(token, process.env.TOKEN);

    if (!decoded) {
      return {
        status: 'error',
        message: 'Token is invalid',
      };
    }

    return decoded;
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }
};

module.exports = {
  signup,
  login,
  authenticate,
  forgotPassword,
  resetPassword,
  authenticateKafka,
};
