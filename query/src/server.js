const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const rootRouter = require("./routes");
const cors = require("cors");
const queryRouter = require("./routes/index.js");
const {
  updateUserStatusConsumer,
  seedingAdminAccountConsumer,
  createPostConsumer,
  updatePostConsumer,
  deletePostConsumer,
  crawlNewsConsumer,
} = require("./consumer");

const {
  signupEvent,
  authenticateEvent,
  updateUserEvent,
} = require("./kafka-auth/auth.consumer");

const {
  addCommentEvent,
  updateCommentEvent,
  deleteCommentEvent,
} = require("./kafka-comment/comment.consumer");

const { checkAuthenEvent } = require("./kafka-auth/auth.producer");
const {
  getTopicConsumer,
  removeTopicConsumer,
} = require("./consumer/topic.consumer.js");
const {
  addTopicCommentConsumer,
  removeATopicCommentConsumer,
  removeTopicCommentConsumer,
} = require("./consumer/topic-comment.consumer.js");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/authen", (req, res, next) => {
  const tokenService =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzE4NGJlMDc5ZDhhYzNmMjk4MjUxNSIsImVtYWlsIjoibmd1eWVudmFuY0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MDIzMzk2OSwiZXhwIjoxNjQwMjU5MTY5fQ.9pTy9DCMR_r0sDcxypOpTMAW4Yz7k1neFsNsd2O-rxU";
  checkAuthenEvent(tokenService);

  return res.status(200).json({
    status: "Success",
    message: "Send request to kafka success",
  });
});

app.use(cors());
app.use(express.json());

app.use(queryRouter);

app.use("/api/v1", rootRouter);

app.all("*", (req, res, next) => {
  next(new AppError("Not Found Router", 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  return res.status(statusCode).json({
    status: status,
    message: err.message,
    stack: err.stack,
  });
});

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

  // crawl
  // updateUserStatusConsumer();
  // seedingAdminAccountConsumer();
  crawlNewsConsumer();
  createPostConsumer();
  updatePostConsumer();
  deletePostConsumer();
  // auth
  signupEvent();
  // authenticateEvent();
  updateUserEvent();

  //comment
  addCommentEvent();
  updateCommentEvent();
  deleteCommentEvent();
  // authenticateEvent();

  //topic
  getTopicConsumer();
  removeTopicConsumer();

  //comment
  addTopicCommentConsumer();
  removeTopicCommentConsumer();
  removeATopicCommentConsumer();
});
