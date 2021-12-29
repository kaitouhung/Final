const Comment = require('../models/comment.model');
const AppError = require('../utils/appError');
const {
  addCommentEvent,
  updateCommentEvent,
  deleteCommentEvent,
} = require('./../kafka/comment.producer');

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (content.length < 0 || !content.length) {
      return next(new AppError('Content is too short', 500));
    }
    const comment = await new Comment(req.body).save();

    addCommentEvent(comment);

    return res.status(200).json({
      status: 'Create Comment Successful',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentPost = async (req, res, next) => {
  try {
    const { postId } = req.query;
    const commentList = await Comment.find({ postId }).sort({ createdAt: -1 });

    if (!commentList) {
      return next(new AppError('PostId invalid, Not found comment list', 500));
    }

    return res.status(200).json({
      status: 'Get All Commet By postId successful',
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

    if (!comment) {
      return next(new AppError('Id invalid ', 500));
    }

    updateCommentEvent(comment);

    return res.status(200).json({
      status: 'Update Comment Success',
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

    deleteCommentEvent(id);

    return res.status(200).json({
      status: 'Delete comment successful',
      data: comment[0],
    });
  } catch (error) {
    return next(new AppError('Id invalid ', 500));
  }
};

module.exports = {
  addComment,
  getCommentPost,
  updateComment,
  deleteComment,
};
