const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, default: '1' },
    topicId: { type: mongoose.SchemaTypes.ObjectId, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId },

    parentId: { type: mongoose.SchemaTypes.ObjectId, default: null },
    content: { type: String },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
