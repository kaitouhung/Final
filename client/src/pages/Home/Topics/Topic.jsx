import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import CommentTopic from './CommentTopic/CommentTopic';
import TopicItem from './TopicItem/TopicItem';

const socket = io.connect('http://localhost:8900');
export default function Topic({ topic, postID }) {
  const [listTopics, setListTopics] = useState([]);
  // const [listComments, setListComments] = useState([]);
  const [comment, setComment] = useState(true);
  const [chooseTopic, setChooseTopic] = useState('');

  useEffect(() => {
    getTopic(1, postID);
  }, []);

  useEffect(() => {
    setListTopics([...listTopics, topic]);
  }, [topic]);

  const getTopic = async (start, postId) => {
    const result = await axios.get(
      `http://localhost:3004/topic?postID=${postId}&start=${start}&limit=10`
    );
    const newList = result.data.data.map((topic) => {
      return {
        ...topic,
        open: true,
        less: true,
      };
    });
    setListTopics(newList);
  };

  const chooseATopic = (topic) => {
    setChooseTopic(topic);
    socket.emit('join-room-topicId', { topicId: topic._id });
    // setComment(!comment);
    // console.log(1, id);
    // console.log("chooseATopic");
    // setListTopics((oldTopics) => {
    //   return oldTopics.map((topic) =>
    //     topic._id === id
    //       ? { ...topic, open: true, less: false }
    //       : { ...topic, open: true, less: true }
    //   );
    // });
  };
  const closeATopic = () => {
    setComment(!comment);
    console.log('closeATopic');
    // setListTopics((oldTopics) => {
    //   return oldTopics.map(
    //     (topic) => ({ ...topic, open: true, less: true })
    //     // topic._id === id ? { ...topic, open: true } : { ...topic, open: true }
    //   );
    // });
  };

  const RenderListTopics = () => {
    return (
      <ul style={{ height: '100%' }}>
        {listTopics?.map((topic1, index) => {
          // if (topic.open && topic.less) {
          return (
            <TopicItem
              key={index}
              topic={topic1}
              chooseATopic={() => chooseATopic(topic1)}
            />
          );
          // }
          // <div></div>;
        })}
      </ul>
    );
  };

  useEffect(() => {
    if (!topic) {
      const user = JSON.parse(localStorage.getItem('user'));
      createTopic(topic._id, user._id, topic.index, topic.content);
    }
  }, [topic]);

  const createTopic = async (postID, userID, index, content) => {
    if (postID && userID && index && content) {
      console.log('sdfsdfsdfsdf');
      const result = await axios.post(
        `http://localhost:3003/topic/create-topic`,
        {
          postID,
          userID,
          index,
          content,
        }
      );
      setListTopics((listTopics) => {
        return [...listTopics, result.data.data];
      });
    } else {
      console.log('postID, userID, index or content is miss');
    }
  };
  return (
    <div style={{ height: '100vh' }}>
      <div
        style={{
          maxHeight: '50%',
          overflow: 'auto',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <RenderListTopics />
      </div>
      <div style={{ maxHeight: '50%' }}>
        <CommentTopic socket={socket} topic={chooseTopic} postID={postID} />
      </div>
    </div>
  );
}
