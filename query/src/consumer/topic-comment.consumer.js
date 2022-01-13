const { Kafka } = require("kafkajs");
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

module.exports = {
  addTopicCommentConsumer,
};
