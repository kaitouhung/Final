const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
