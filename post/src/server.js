const express = require("express");
const mongoose = require("mongoose");
const { crawlNewsConsumer } = require("./post.consumer.js");
require("dotenv").config();
const postRouter = require("./routes/index.js");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use(postRouter);

app.use((err, req, res, next) => {
  return res.status(err.statusCode).send({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Connect database successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  crawlNewsConsumer();
});
