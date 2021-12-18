const express = require("express");
const { createPostProducer } = require("../post.producer.js");
const router = express.Router();
const { Post } = require("./../models/post.model.js");

router.post("/create-post", async (req, res, next) => {
  try {
    const { title, description, content, author, image, category } = req.body;
    const newPost = await Post.create({
      title,
      description,
      content,
      author,
      image,
      category,
    });
    createPostProducer(newPost);
    res.status(200).send(newPost);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
