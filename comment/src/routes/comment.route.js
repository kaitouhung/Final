const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/comment.controller");

router.post("/", commentController.addComment);
router.get("/", commentController.getCommentPost);
router.patch("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);
router.get("/topic-comments", commentController.getTopicComments);
router.post("/topic-comments", commentController.addTopicComment);

module.exports = router;
