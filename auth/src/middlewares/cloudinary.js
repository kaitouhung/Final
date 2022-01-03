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

const removeImage = async (req, res, next) => {
  try {
    let typeId = null;
    if (req.user._id) {
      typeId = req.user._id;
    }
    // using for deleteuser
    if (req.params.id) {
      typeId = req.params.id;
    }
    const userCloudinary = await UserCloud.findOne({ userId: typeId });
    if (userCloudinary) {
      await Promise.all([
        cloudinary.uploader.destroy(userCloudinary.public_id, {
          upload_preset: 'users',
        }),
        UserCloud.deleteOne({ userId: typeId }),
      ]);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImageCloud,
  removeImage,
};
