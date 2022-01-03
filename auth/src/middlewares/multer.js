const multer = require('multer');
const path = require('path');

const checkFileTypeImage = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only!');
  }
};
const checkFileTypeAny = (file, cb) => {
  return cb(null, true);
};
const uploadImage = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    checkFileTypeImage(file, cb);
  },
});

const uploadFile = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    checkFileTypeAny(file, cb);
  },
});

module.exports = {
  uploadImage,
  uploadFile,
};
