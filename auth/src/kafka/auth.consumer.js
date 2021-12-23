const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];
const { authenticateKafka } = require('./../controllers/auth.controller');
const { authenticateEvent } = require('./auth.producer');

const checkAuthenEvent = async () => {
  const clientId = 'service-checkAuthen';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'service-authen';

  const authConsumer = kafka.consumer({ groupId: clientId });
  await authConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await authConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const tokenService = JSON.parse(message.value.toString());

      if (tokenService) {
        const user = authenticateKafka(tokenService);
        authenticateEvent(user);
      } else {
        authenticateEvent({
          status: 'error',
          message: "Auth Service don't received token",
        });
      }
    },
  });
};

module.exports = {
  checkAuthenEvent,
};
