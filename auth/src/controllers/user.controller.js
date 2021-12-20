const User = require('./../models/user.model');
const AppError = require('./../utils/appError');

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

module.exports = {
  getUserByMyself,
};
