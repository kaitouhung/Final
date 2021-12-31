const Comment = require("../models/comment.model");
const {
  addTopicCommentProducer,
} = require("../producer/topic-comment.producer");
const AppError = require("../utils/appError");

const addComment = async (req, res, next) => {
  try {
    const comment = await new Comment(req.body).save();

    return res.status(200).json({
      status: "Create Comment Successful",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentPost = async (req, res, next) => {
  try {
    const { postId } = req.query;
    const commentList = await Comment.find({ postId });

    if (!commentList) {
      return new AppError("PostId invalid, Not found comment list", 500);
    }

    return res.status(200).json({
      status: "Get All Commet By postId successful",
      data: commentList,
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "Update Comment Success",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const comment = await Comment.findByIdAndDelete(id);
    const comment = await Promise.all([
      Comment.findByIdAndDelete(id),
      Comment.deleteMany({ parentId: id }),
    ]);

    return res.status(200).json({
      status: "Delete comment successful",
      data: comment[0],
    });
  } catch (error) {
    next(error);
  }
};

const getTopicComments = async (req, res, next) => {
  try {
    const { postId, topicId } = req.query;
    const commentList = await Comment.find({ postId, topicId });

    if (!commentList) {
      return new AppError("PostId invalid, Not found comment list", 500);
    }

    return res.status(200).json({
      status: "Get All Commet By postId successful",
      data: commentList,
    });
  } catch (error) {
    next(error);
  }
};

const addTopicComment = async (req, res, next) => {
  try {
    const comment = await new Comment(req.body).save();
    addTopicCommentProducer(comment);
    return res.status(200).json({
      status: "Create Comment Successful",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getCommentPost,
  updateComment,
  deleteComment,
  getTopicComments,
  addTopicComment,
};
