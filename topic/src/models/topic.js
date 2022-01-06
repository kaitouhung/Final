const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    postID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    index: {
      type: Object,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Topic = mongoose.model("topic", topicSchema);

module.exports = { Topic };
