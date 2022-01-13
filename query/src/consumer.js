const { Kafka } = require("kafkajs");
const models = require("./db/index.js");
const { Post } = require("./db/models/post.model.js");

const brokers = ["localhost:9092"];

const updateUserStatusConsumer = async () => {
  const clientId = "query-update-user";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "update-user-status" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const userData = JSON.parse(message.value.toString());
      await models.User.findByIdAndUpdate(
        userData._id,
        {
          $set: { status: userData.status },
        },
        { upsert: true }
      );
      console.log({
        message: "Update user status successful in service query",
      });
    },
  });
};

const seedingAdminAccountConsumer = async () => {
  const clientId = "query-seeding-admin";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "seed-admin-account" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const userData = JSON.parse(message.value.toString());
      await models.User.create(userData);
      console.log({ message: "Seeding admin account successful" });
    },
  });
};

const createPostConsumer = async () => {
  const clientId = "query-create-post";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "create-post" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const postData = JSON.parse(message.value.toString());
      console.log(postData);
      await Post.create(postData);
      console.log({ message: "Create post successfully" });
    },
  });
};

const updatePostConsumer = async () => {
  const clientId = "query-update-post";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "update-post" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const postData = JSON.parse(message.value.toString());
      await Post.findByIdAndUpdate(postData._id, { $set: postData });
      console.log({ message: "update post successfully" });
    },
  });
};

const deletePostConsumer = async () => {
  const clientId = "query-delete-post";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "delete-post" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const postData = JSON.parse(message.value.toString());
      console.log(postData);
      await Post.findOneAndDelete({ _id: postData });
      console.log({ message: "Delete post successfully" });
    },
  });
};

const crawlNewsConsumer = async () => {
  const clientId = "crawl-news-client-id-query";
  const kafka = new Kafka({ clientId, brokers });

  const consumer = await kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "crawl-news" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const newsData = JSON.parse(message.value.toString());
      const randomPostIndex = Math.floor(Math.random() * newsData.length) - 1;
      const findPost = await Post.findOne({
        title: newsData[randomPostIndex].title,
      });
      if (!findPost) {
        await Post.insertMany(newsData);
        console.log({ message: "crawl news successful" });
      } else {
        console.log({ message: "Crawler news already" });
      }
    },
  });
};

module.exports = {
  updateUserStatusConsumer,
  seedingAdminAccountConsumer,
  createPostConsumer,
  crawlNewsConsumer,
  deletePostConsumer,
  updatePostConsumer,
};
