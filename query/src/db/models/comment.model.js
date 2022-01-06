const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.SchemaTypes.ObjectId, default: '1' },
    topicId: { type: mongoose.SchemaTypes.ObjectId, default: null },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },

    parentId: { type: mongoose.SchemaTypes.ObjectId, default: null },
    content: { type: String },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
