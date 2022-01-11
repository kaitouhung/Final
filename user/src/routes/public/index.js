const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../../models/user.model.js");

const router = express.Router();

const jwt = require("jsonwebtoken");
const AppError = require("../../middleware/handleError/AppError.js");

router.get("/test", (req, res, next) => {
  try {
    return res.status(200).send("asdadsasd");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new AppError(400, "User not found");

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) throw new AppError(400, "Password was incorrect");

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    next(error);
    // next(error);
  }
});

module.exports = router;
