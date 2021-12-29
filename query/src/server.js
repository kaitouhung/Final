const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { rootRouter } = require('./routes');
const cors = require('cors');
const {
  updateUserStatusConsumer,
  seedingAdminAccountConsumer,
  createPostConsumer,
  crawlNewsConsumer,
} = require('./consumer');

const {
  signupEvent,
  authenticateEvent,
} = require('./kafka-auth/auth.consumer');

const {
  addCommentEvent,
  updateCommentEvent,
  deleteCommentEvent,
} = require('./kafka-comment/comment.consumer');

const { checkAuthenEvent } = require('./kafka-auth/auth.producer');

const app = express();

app.get('/authen', (req, res, next) => {
  const tokenService =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzE4NGJlMDc5ZDhhYzNmMjk4MjUxNSIsImVtYWlsIjoibmd1eWVudmFuY0BnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY0MDIzMzk2OSwiZXhwIjoxNjQwMjU5MTY5fQ.9pTy9DCMR_r0sDcxypOpTMAW4Yz7k1neFsNsd2O-rxU';
  checkAuthenEvent(tokenService);

  return res.status(200).json({
    status: 'Success',
    message: 'Send request to kafka success',
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/v1', rootRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Not Found Router', 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  return res.status(statusCode).json({
    status: status,
    message: err.message,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, () => {
  console.log('Listening on port 3004');
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log('Connect successfully');
    })
    .catch((err) => {
      console.log(err);
    });
  // updateUserStatusConsumer();
  // seedingAdminAccountConsumer();
  // createPostConsumer();
  // crawlNewsConsumer();

  // auth
  // signupEvent();
  // authenticateEvent();

  //comment
  addCommentEvent();
  updateCommentEvent();
  deleteCommentEvent();
});
