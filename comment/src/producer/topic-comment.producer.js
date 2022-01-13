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

module.exports = {
  addTopicCommentProducer,
};
