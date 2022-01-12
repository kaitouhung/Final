const { Kafka } = require("kafkajs");
const brokers = ["localhost:9092"];

const addTopicCommentProducer = async (data) => {
  const clientId = "add-topic-comment";
  const kafka = new Kafka({ clientId, brokers });

  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: clientId,
    messages: [{ value: JSON.stringify(data) }],
  });
  await producer.disconnect();
};

const removeTopicCommentProducer = async (topicId) => {
  const clientId = "remove-comments-of-topic";
  const kafka = new Kafka({ clientId, brokers });

  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: clientId,
    messages: [{ value: topicId }],
  });
  await producer.disconnect();
};

module.exports = {
  addTopicCommentProducer,
  removeTopicCommentProducer,
};
