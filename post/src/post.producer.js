const { Kafka } = require("kafkajs");
const brokers = ["localhost:9092"];

const createPostProducer = async (post) => {
  clientId = "create-post-client-id";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = await kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "create-post",
    messages: [{ value: JSON.stringify(post) }],
  });
  await producer.disconnect();
};

const deletePostProducer = async (post) => {
  clientId = "delete-post-client-id";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = await kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "delete-post",
    messages: [{ value: JSON.stringify(post) }],
  });
  await producer.disconnect();
};

module.exports = { createPostProducer, deletePostProducer };
