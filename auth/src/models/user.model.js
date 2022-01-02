const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { randomBytes, createHash } = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
    passwordConfirm: { type: String },
    fullName: { type: String, default: 'anonymous' },
    role: { type: String, default: 'user' },
    status: { type: Boolean, default: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = function (passwordUser, passwordDb) {
  const isMatched = bcrypt.compareSync(passwordUser, passwordDb);
  return isMatched;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString('hex');

  this.passwordResetToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // reset Token expires after 10 seconds
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
