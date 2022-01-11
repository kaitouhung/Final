const mongoose = require("mongoose");
const { userRole } = require("../constant/user");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: userRole.user,
      enum: Object.values(userRole),
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
      enum: [true, false],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
