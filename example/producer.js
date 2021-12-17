const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();

app.post('/test', async (req, res, next) => {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });

  const topicName = 'orderCreated';
  const user = {
    customerId: 1,
    name: 'Hung',
  };

  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: topicName,
    messages: [{ value: JSON.stringify(user) }],
  });

  // await producer.disconnect();

  return res.status(200).json({
    messages: 'Success',
  });
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server Post is running on ${PORT}`);
});
