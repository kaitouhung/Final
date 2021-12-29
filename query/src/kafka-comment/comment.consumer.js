const { Kafka } = require('kafkajs');
const brokers = ['localhost:9092'];
const Comment = require('./../db/models/comment.model');

const addCommentEvent = async () => {
  const clientId = 'query-addCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-addComment';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const comment = JSON.parse(message.value.toString());

      if (comment) {
        await new Comment(comment).save();
      }
    },
  });
};

const updateCommentEvent = async () => {
  const clientId = 'query-updateCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-updateComment';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const comment = JSON.parse(message.value.toString());

      if (comment) {
        await Comment.findByIdAndUpdate(comment._id, comment, {
          new: true,
        });
      }
    },
  });
};

const deleteCommentEvent = async () => {
  const clientId = 'query-deleteCommentEvent';
  const kafka = new Kafka({
    clientId,
    brokers,
  });

  const topicName = 'comment-deleteComment';

  const queryConsumer = kafka.consumer({ groupId: clientId });
  await queryConsumer.subscribe({ topic: topicName, fromBeginning: true });

  await queryConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const id = JSON.parse(message.value.toString());

      if (id) {
        await Promise.all([
          Comment.findByIdAndDelete(id),
          Comment.deleteMany({ parentId: id }),
        ]);
      }
    },
  });
};

module.exports = {
  addCommentEvent,
  updateCommentEvent,
  deleteCommentEvent,
};
