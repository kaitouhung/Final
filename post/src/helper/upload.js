const multer = require("multer");

const imageUploadPath = "public/images";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
    }
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

exports.imageUpload = multer({ storage: storage });
