const express = require('express');
const rootRouter = express.Router();

const commentRouter = require('./comment.route');

rootRouter.use('/comments', commentRouter);

module.exports = {
  rootRouter,
};
