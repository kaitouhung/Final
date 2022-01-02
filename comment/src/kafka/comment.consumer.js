const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];

const authenticateEvent = async (req, res, next) => {
  const clientId = 'query-authenticateEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'auth-authen';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const dataFromAuth = JSON.parse(message.value);

      // if()

      if (dataFromAuth.status !== 'error') {
        req.user = dataFromAuth;
        next();

        // console.log(dataFromAuth);
      }
      // return;
      // next();
      // }

      return res.status(401).json({
        status: user.status,
        message: user.message,
      });
    },
  });
};

module.exports = {
  authenticateEvent,
};
