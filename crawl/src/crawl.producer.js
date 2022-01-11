const { Kafka } = require("kafkajs");
const brokers = ["localhost:9092"];

const crawlNewsProducer = async (news) => {
  const clientId = "crawl-news-client-id";
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const producer = await kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "crawl-news",
    messages: [{ value: JSON.stringify(news) }],
  });
  await producer.disconnect();
};

module.exports = { crawlNewsProducer };
