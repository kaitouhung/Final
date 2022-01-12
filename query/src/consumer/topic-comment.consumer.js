const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const brokers = ["localhost:9092"];
const models = require("./../db/index.js");

const addTopicCommentConsumer = async () => {
  const clientId = "add-topic-comment";
  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic: clientId, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      await models.Comment.create({ ...data });
      console.log({ message: "create topic comment successfull" });
    },
  });
};

const removeTopicCommentConsumer = async () => {
  const clientId = "remove-comments-of-topic";
  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic: clientId, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const topicId = message.value.toString();
      console.log(topicId);
      await models.Comment.findOneAndDelete({
        topicId: mongoose.Types.ObjectId(topicId),
      });
      console.log({ message: "remove comments of a topic successfull" });
    },
  });
};

module.exports = {
  addTopicCommentConsumer,
  removeTopicCommentConsumer,
};
