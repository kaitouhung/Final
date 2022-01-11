const { Kafka } = require('kafkajs');
const { User } = require('./../db/models/user.model');
const brokers = ['localhost:9092'];

const signupEvent = async () => {
  const clientId = 'query-signupEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'auth-signup';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const user = JSON.parse(message.value.toString());

      if (user) {
        await new User(user).save();
        console.log('::::Receive success new User from Auth Service');
      }
    },
  });
};

const updateUserEvent = async () => {
  const clientId = 'query-updateUserEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'auth-updateUser';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const user = JSON.parse(message.value);

      if (user) {
        await User.findByIdAndUpdate(user._id, user, {
          new: true,
        });
      }
    },
  });
};

const authenticateEvent = async () => {
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
      console.log(`Info User receive::`, message.value.toString());
    },
  });
};

module.exports = {
  signupEvent,
  authenticateEvent,
  updateUserEvent,
};
