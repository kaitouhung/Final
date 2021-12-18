const jwt = require("jsonwebtoken");
// const { User } = require("../../models/user.model.js");
const AppError = require("../handleError/AppError.js");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new AppError(403, "Invalid token");
    } else {
      jwt.verify(token, process.env.SECRET_KEY, async (err, userData) => {
        if (err) throw new AppError(403, "Invalid token");
        else {
          // const user = await User.findById(userData.id);
          // if (user) {
          //   res.locals.userInfor = user;
          //   next();
          // } else throw new AppError(403, "Invalid token");
          next();
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
