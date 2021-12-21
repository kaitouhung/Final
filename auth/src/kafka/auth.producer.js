const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];

const signupEvent = async (user) => {
  const clientId = 'auth-signupEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'auth-signup';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(user) }],
  });

  await producer.disconnect();
};

module.exports = {
  signupEvent,
};
