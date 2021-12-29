const express = require('express');
const router = express.Router();
const commentController = require('./../controllers/comment.controller');

router.get('/', commentController.getCommentPost);

module.exports = router;
