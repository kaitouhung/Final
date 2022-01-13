const express = require("express");
const router = express.Router();
const models = require("./../db/index.js");
const topicRouter = require("./topic/index.js");
const topicCommentsRouter = require("./comment/topicComments/index.js");
const commentRouter = require("./comment.route");

// get comment postId
router.use("/comments", commentRouter);

router.get("/categorys", async (req, res, next) => {
  try {
    const category = await models.Post.distinct("category");
    res.status(200).send({ data: category });
  } catch (error) {
    console.log(error);
  }
});
router.get("/posts", async (req, res, next) => {
  try {
    const { category = "", page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const query = {};
    if (category) query.category = category;

    const [posts, totalPosts] = await Promise.all([
      models.Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      models.Post.count(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);
    res.status(200).send({ data: posts, totalPages });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/get-all-post", async (req, res, next) => {
  try {
    const { KeyWord, page, pageSize } = req.body;
    let numberOfResult = 0;
    let postList = {};
    const allPost = await models.Post.find({})
      .sort({ $natural: -1 })

      .skip(page * pageSize)
      .limit(pageSize)
      .exec((err, posts) => {
        models.Post.countDocuments((err, count) => {
          if (err) return next(err);
          res.status(200).send({ result: posts, numberOfResult: count });
        });
      });
    // createPostProducer(newPost);
  } catch (error) {
    next(error);
  }
});

router.use("/topic", topicRouter);
router.use("/topic-comments", topicCommentsRouter);

module.exports = router;
