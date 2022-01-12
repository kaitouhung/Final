const express = require("express");
const {
  createPostProducer,
  updatePostProducer,
} = require("../post.producer.js");
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

router.put("/update-post/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { description } = req.body;
    console.log(description);
    const newPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: { description },
      },
      { new: true }
    );
    updatePostProducer(newPost);
    res.status(200).send({ data: newPost });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
