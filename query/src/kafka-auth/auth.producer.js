const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];

const checkAuthenEvent = async (tokenSerive) => {
  const clientId = 'query-authenticateEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'service-authen';

  const producer = kafka.producer();
  await producer.connect();

  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(tokenSerive) }],
  });

  await producer.disconnect();
};

module.exports = {
  checkAuthenEvent,
};
