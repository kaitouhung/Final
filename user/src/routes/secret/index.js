const express = require("express");
const { User } = require("../../models/user.model.js");
const router = express.Router();

const jwt = require("jsonwebtoken");

const AppError = require("../../middleware/handleError/AppError.js");
const { userRole } = require("../../constant/user.js");
const { updateUserStatusProducer } = require("../../producer.js");

router.put("/update-status/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = res.locals.userInfor;
    const userFind = await User.findById(id);
    if (!userFind) throw new AppError(404, "Can not found this id");
    if (user.role === userRole.user)
      throw new AppError(404, "You don't have enough permission");
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { status: !userFind.status },
      },
      { new: true }
    );
    updateUserStatusProducer(updateUser);
    res.send(updateUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
