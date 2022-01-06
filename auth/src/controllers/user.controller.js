const User = require('./../models/user.model');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const { updateUserEvent } = require('./../kafka/auth.producer');
const { removeImageSync } = require('./../middlewares/cloudinary');

const getUserByMyself = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select({ password: 0, __v: 0 });
    if (!user) {
      return next(new AppError('No User with that ID', 404));
    }

    return res.status(200).json({
      status: 'Success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('No User with that ID', 403));
    removeImageSync(user);

    const { cloudinary } = req;
    user.avatar = cloudinary.secure_url;

    await user.save();
    user.password = undefined;

    updateUserEvent(user);

    return res.status(200).json({
      status: 'Upload avatar success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const omitByCustom = (obj) => {
  let newObj = {};
  for (let key in obj) {
    if (obj[key] !== '' && obj[key] !== undefined) {
      Object.assign(newObj, { [key]: obj[key] });
    }
  }
  return newObj;
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const updateUser = async (req, res, next) => {
  try {
    const { password, newPassword, fullName } = req.body;

    let user = {
      password,
      fullName,
    };
    user = omitByCustom(user);

    const userDB = await User.findById(req.user._id);
    if (user.password) {
      if (!userDB.comparePassword(password, userDB.password)) {
        return next(new AppError('Password Wrong', 400));
      }
      user.password = hashPassword(newPassword);
    }

    const newUser = await User.findByIdAndUpdate(req.user._id, user, {
      new: true,
    }).select({ password: 0, __v: 0 });

    return res.status(200).json({
      status: 'Update User successfully',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserByMyself,
  uploadAvatar,
  updateUser,
};
