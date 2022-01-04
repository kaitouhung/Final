const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { UserCloud } = require('./../models/userCloud.model');
// const AppError = require('./../utils/appError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageCloud = async (req, res, next) => {
  try {
    let result = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'users',
      resource_type: 'auto', // jpeg, png
    });

    req.cloudinary = result;
    next();
  } catch (error) {
    next(error);
  }
};

const removeImageSync = async (user) => {
  try {
    const { avatar } = user;

    if (avatar) {
      const public_id = avatar.slice(avatar.indexOf('users')).split('.')[0];

      cloudinary.uploader.destroy(public_id, {
        upload_preset: 'users',
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  uploadImageCloud,
  removeImageSync,
};
