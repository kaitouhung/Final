const express = require('express');
const rootRouter = express.Router();

const userRouter = require('./comment.route');

rootRouter.use('/comments', userRouter);

module.exports = {
  rootRouter,
};
