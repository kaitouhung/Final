const express = require("express");
const AppError = require("../middleware/handleError/AppError");
const { Topic } = require("../models/topic");
const {
  getTopicProducer,
  removeTopicProducer,
} = require("../producer/topic.producer");
const router = express.Router();

router.post("/create-topic", async (req, res, next) => {
  try {
    const { postID, userID, index, content } = req.body;
    const topic = await Topic.create({ postID, userID, index, content });
    await getTopicProducer(topic);
    res.status(200).send({ data: topic });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const topic = await Topic.findByIdAndDelete(id);
    await removeTopicProducer(id);
    res.status(200).send({ data: topic });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
