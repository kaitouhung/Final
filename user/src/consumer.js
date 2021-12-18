const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "user-kafka",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "user-group" });

module.exports = {};
