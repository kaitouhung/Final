const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();

const testConsumer = async (req, res, next) => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });

  const topicName = 'orderCreated';

  const ordersConsumer = kafka.consumer({ groupId: 'orders' });

  await ordersConsumer.connect();
  await ordersConsumer.subscribe({ topic: topicName, fromBeginning: true });
  await ordersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `To Partition ${partition} -> message ${message.value.toString()}`
      );
    },
  });
};

testConsumer();

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server Comment is running on ${PORT}`);
});
