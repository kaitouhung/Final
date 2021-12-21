const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const {
  updateUserStatusConsumer,
  seedingAdminAccountConsumer,
  createPostConsumer,
  crawlNewsConsumer,
} = require('./consumer');

const { signupEvent } = require('./kafka-auth/auth.consumer');

const app = express();

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
  updateUserStatusConsumer();
  seedingAdminAccountConsumer();
  createPostConsumer();
  crawlNewsConsumer();
  // auth
  signupEvent();
});
