const mongoose = require('mongoose');

const UserCloudSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    public_id: { type: String },
    secure_url: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserCloud = mongoose.model('UserCloud', UserCloudSchema, 'UserCloud');

module.exports = {
  UserCloudSchema,
  UserCloud,
};
