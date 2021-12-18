const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
      default: 2,
      enum: [1, 2],
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
