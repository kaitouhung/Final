const Comment = require('./../db/models/comment.model');
const AppError = require('../utils/appError');

const getCommentPost = async (req, res, next) => {
  try {
    const { postId } = req.query;
    const commentList = await Comment.find({ postId })
      .populate({
        path: 'userId',
        select: '_id fullName avatar',
      })
      .sort({ createdAt: -1 });

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

module.exports = {
  getCommentPost,
};
