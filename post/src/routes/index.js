const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const {
  createPostProducer,
  updatePostProducer,
  deletePostProducer,
} = require("../post.producer.js");
const router = express.Router();
const { Post } = require("./../models/post.model.js");
const { imageUpload } = require("../helper/upload.js");

cloudinary.config({
  cloud_name: "dn4nqzjpm",
  api_key: "862411972575321",
  api_secret: "yCHezKe9qh-xMp71AuwBZ90jbAU",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Final",
  },
});

router.post("/get-all-post", async (req, res, next) => {
  try {
    const { KeyWord, page, pageSize } = req.body;
    let numberOfResult = 0;
    let postList = {};
    const allPost = await Post.find({})
      .sort({ $natural: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .exec((err, posts) => {
        Post.countDocuments((err, count) => {
          if (err) return next(err);
          res.status(200).send({ result: posts, numberOfResult: count });
        });
      });
    // createPostProducer(newPost);
  } catch (error) {
    next(error);
  }
});
const upload = multer({ storage: storage });
const { uploadImage } = require("./../helper/multer");

router.post(
  "/create-post",
  // uploadImage.single("image"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      const image = req.file.path;

      const { title, description, content, author, category } = req.body;

      const newPost = await Post.create({
        title,
        description,
        content,
        author,
        image,
        category,
      });
      createPostProducer(newPost);
      res.status(200).send({ msg: "Created Success" });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
);

router.post("/update-post", upload.single("image"), async (req, res, next) => {
  try {
    const { id, title, description, content, author, category } = req.body;

    let image = "";
    if (req.hasOwnProperty("file")) {
      image = req.file.path;
    } else {
      const post = await Post.findOne({ _id: id }).select("image");
      image = post.image;
    }

    const updatePost = await Post.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        content,
        author,
        image,
        category,
        image,
      },
      { new: true }
    );
    updatePostProducer(updatePost);
    console.log(updatePost);
    res.status(200).send({ msg: "updated successfully", image: image });
  } catch (error) {
    console.log(error);

    next(error);
  }
});

router.post("/delete-post", async (req, res, next) => {
  try {
    const { id } = req.body;
    const updatePost = await Post.findOneAndDelete({ _id: id });
    // res.status(200).send(updatePost);
    deletePostProducer(id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
