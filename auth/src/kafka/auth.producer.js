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

const authenticateEvent = async (user) => {
  const clientId = 'auth-authenticateEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicname = 'auth-authen';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicname,
    messages: [{ value: JSON.stringify(user) }],
  });

  await producer.disconnect();
};

const updateUserEvent = async (user) => {
  const clientId = 'auth-updateUserEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'auth-updateUser';

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
  authenticateEvent,
  updateUserEvent,
};
