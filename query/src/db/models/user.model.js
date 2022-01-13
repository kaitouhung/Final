const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
      enum: [true, false],
    },
    fullName: { type: String, require: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
