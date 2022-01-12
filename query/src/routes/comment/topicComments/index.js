const express = require("express");
const router = express.Router();
const models = require("./../../../db/index.js");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  try {
    const { postId, topicId } = req.query;
    const result = await models.Comment.aggregate([
      {
        $match: {
          postId: mongoose.mongo.ObjectId(postId),
          topicId: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$user_id"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                email: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: "topics",
          let: { topic_id: "$topicId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$topic_id"],
                    },
                  ],
                },
              },
            },
            // {
            //   $project: {
            //     email: 1,
            //     fullName: 1,
            //   },
            // },
          ],
          as: "topicContent",
        },
      },
      { $unwind: "$topicContent" },
      { $addFields: { topicContent: "$topicContent.content" } },
      {
        $group: {
          _id: "$topicId",
          createdAt: { $first: "$createdAt" },
          data: {
            $push: "$$ROOT",
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    res.status(200).send({ data: result });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
