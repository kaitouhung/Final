const User = require('./../models/user.model');
const { UserCloud } = require('./../models/userCloud.model');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const { updateUserEvent } = require('./../kafka/auth.producer');

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

const uploadAvatar = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('No User with that ID', 403));

    const { cloudinary } = req;
    user.avatar = cloudinary.secure_url;

    const newCloudinary = {
      userId: req.user._id,
      public_id: cloudinary.public_id,
      secure_url: cloudinary.secure_url,
    };

    const result = await Promise.all([
      user.save(),
      new UserCloud(newCloudinary).save(),
    ]);

    const userUpdated = result[0].toObject({
      transform: (doc, ret, option) => {
        delete ret.password;
        return ret;
      },
    });

    updateUserEvent(userUpdated);

    return res.status(200).json({
      status: 'Upload avatar success',
      data: userUpdated,
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
