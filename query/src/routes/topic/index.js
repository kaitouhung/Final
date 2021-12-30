const express = require("express");
const AppError = require("../../../../topic/src/middleware/handleError/AppError.js");
const models = require("./../../db/index.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { postID, start = 1, limit = 10 } = req.query;
    if (!postID) throw new AppError(404, "PostID must be required");
    const skip = (Number(start) - 1) * Number(limit);
    const [topics, totalTopics] = await Promise.all([
      models.Topic.find({ postID }).skip(skip).limit(limit),
      models.Topic.count({ postID }),
    ]);

    const totalPages = Math.ceil(totalTopics / Number(limit));

    res.status(200).send({ totalPages, data: topics });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
