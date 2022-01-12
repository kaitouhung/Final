const { Kafka } = require("kafkajs");
const brokers = ["localhost:9092"];
const models = require("./../db/index.js");

const getTopicConsumer = async () => {
  const clientId = "create-topic";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic: clientId, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const newTopic = JSON.parse(message.value.toString());
      await models.Topic.create(newTopic);
      console.log({ message: "create a topic successful" });
    },
  });
};

const removeTopicConsumer = async () => {
  const clientId = "remove-topic";
  const kafka = new Kafka({
    clientId,
    brokers,
  });
  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic: clientId, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const topicId = message.value.toString();
      await models.Topic.findByIdAndDelete(topicId);
      console.log({ message: "remove a topic successful" });
    },
  });
};

module.exports = { getTopicConsumer, removeTopicConsumer };
