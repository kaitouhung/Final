const { Kafka } = require("kafkajs");
const { Post } = require("./models/post.model.js");
const brokers = ["localhost:9092"];

const crawlNewsConsumer = async () => {
  const clientId = "crawl-news-client-id";
  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: "crawl-news" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const newsData = JSON.parse(message.value.toString());
      console.log(newsData[0]);
      const randomPostIndex = Math.floor(Math.random() * newsData.length) - 1;
      const findPost = await Post.findOne({
        title: newsData[randomPostIndex].title,
      });
      if (!findPost) {
        await Post.insertMany(newsData);
        console.log({ message: "crawler new to post service successful" });
      } else {
        console.log({ message: "Crawler news already" });
      }
    },
  });
};

module.exports = { crawlNewsConsumer };
