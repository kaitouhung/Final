const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];

const addCommentEvent = async (comment) => {
  const clientId = 'comment-addCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-addComment';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(comment) }],
  });

  await producer.disconnect();
};

const updateCommentEvent = async (comment) => {
  const clientId = 'comment-updateCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-updateComment';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(comment) }],
  });

  await producer.disconnect();
};

const deleteCommentEvent = async (id) => {
  const clientId = 'comment-deleteCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-deleteComment';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(id) }],
  });

  await producer.disconnect();
};

module.exports = {
  addCommentEvent,
  updateCommentEvent,
  deleteCommentEvent,
};
