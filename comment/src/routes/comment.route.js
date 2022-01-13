const express = require("express");
const router = express.Router();
const commentController = require("./../controllers/comment.controller");

router.post("/", commentController.authenticate, commentController.addComment);
router.get("/", commentController.getCommentPost);
router.patch(
  "/:id",
  commentController.authenticate,
  commentController.updateComment
);
router.delete(
  "/:id",
  commentController.authenticate,
  commentController.deleteComment
);

router.get("/topic-comments", commentController.getTopicComments);
router.post("/topic-comments", commentController.addTopicComment);
router.delete(
  "/comments-of-topic/:id",
  commentController.removeCommentsOfTopic
);
router.delete(
  "/a-comment-of-topic/:id",
  commentController.removeACommentOfTopic
);

module.exports = router;
