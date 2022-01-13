const { Kafka } = require("kafkajs");
const brokers = ["localhost:9092"];

const getTopicProducer = async (topic) => {
  const clientId = "create-topic";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: clientId,
    messages: [{ value: JSON.stringify(topic) }],
  });
  await producer.disconnect();
};
const removeTopicProducer = async (topicId) => {
  const clientId = "remove-topic";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: clientId,
    messages: [{ value: topicId.toString() }],
  });
  await producer.disconnect();
};

module.exports = { getTopicProducer, removeTopicProducer };
