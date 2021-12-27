const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  updateUserStatusConsumer,
  seedingAdminAccountConsumer,
  createPostConsumer,
  crawlNewsConsumer,
} = require("./consumer");
const postRouter = require("./routes/index.js");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(postRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening on port 3004");
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Connect successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  updateUserStatusConsumer();
  seedingAdminAccountConsumer();
  createPostConsumer();
  crawlNewsConsumer();
});
