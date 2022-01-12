const express = require("express");
const axios = require("axios");
const { crawlNewsProducer } = require("./crawl.producer");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const crawlPost = async () => {
  try {
    const categories = ["business", "health", "sports", "science"];

    const postFollowCategory = await Promise.all(
      categories.map(async (category) => {
        const urlNews = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=20&apiKey=${process.env.NEWS_KEY}`;

        const newsResponse = await axios.get(urlNews);

        const postListCategory = [];
        for (let i = 0; i < newsResponse.data.articles.length; i++) {
          const post = newsResponse.data.articles[i];
          if (post.author !== null && post.content !== null) {
            postListCategory.push({
              _id: mongoose.Types.ObjectId(),
              title: post.title,
              description: post.description,
              content: post.content,
              author: post.author,
              image: post.urlToImage,
              category: category,
              createAt: post.publishedAt,
            });
          }
        }

        return postListCategory;
      })
    );

    const postList = [].concat.apply([], postFollowCategory);
    crawlNewsProducer(postList);
    // console.log(postList);
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

crawlPost();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Crawl is running on ${PORT}`);
});
