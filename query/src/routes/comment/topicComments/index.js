const express = require('express');
const router = express.Router();
const models = require('./../../../db/index.js');
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  try {
    const { postId, topicId } = req.query;
    console.log(postId, topicId);
    const result = await models.Comment.aggregate([
      {
        $match: { postId: postId, topicId: mongoose.mongo.ObjectId(topicId) },
      },
      {
        $lookup: {
          from: 'users',
          let: { user_id: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        { $toString: '$_id' },
                        mongoose.mongo.ObjectId('$$user_id'),
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                email: 1,
                fullName: 1,
                // _id: 0,
              },
            },
          ],
          as: 'userData',
        },
      },
      { $unwind: '$userData' },
    ]).sort({ createdAt: -1 });
    res.status(200).send({ data: result });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
