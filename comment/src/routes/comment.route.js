const express = require('express');
const router = express.Router();
const commentController = require('./../controllers/comment.controller');

router.post('/', commentController.addComment);
router.get('/', commentController.getCommentPost);
router.patch('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
