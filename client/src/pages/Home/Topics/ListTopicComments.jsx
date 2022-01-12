import React, { useEffect, useState } from "react";
import axios from "axios";
import TopicComment from "./TopicComment";

export default function ListTopicComments({
  postId,
  socket,
  newComment,
  handleRemoveTopic,
}) {
  const [listComments, setListComments] = useState([]);

  useEffect(() => {
    getListComments();
  }, [postId]);

  const handleDeleteTopic = async (comment) => {
    const newList = listComments.filter(
      (topic) => topic._id !== comment.topicId
    );
    await axios.delete(`http://localhost:3003/topic/${comment.topicId}`);
    await axios.delete(
      `http://localhost:8081/api/v1/comments/comments-of-topic/${comment.topicId}`
    );
    setListComments(newList);

    handleRemoveTopic(comment.topicContent);
    socket.emit("remove-topic", { comment });
  };

  // const handleDeleteTopicComment = (commentId) => {
  //   // setComment(data);
  // };

  useEffect(() => {
    if (newComment._id) {
      if (listComments.length === 0) {
        setListComments([
          ...listComments,
          {
            _id: newComment.topicId,
            createdAt: newComment.createdAt,
            data: [{ ...newComment }],
          },
        ]);
      } else {
        let newTopic = false;
        const result = listComments.map((comment) => {
          if (comment.topicId === newComment.topicId) {
            return [...comment.data, newComment];
          } else {
            newTopic = true;
            return comment;
          }
        });
        if (newTopic) {
          setListComments([
            ...listComments,
            {
              _id: newComment.topicId,
              data: [{ ...newComment }],
            },
          ]);
        } else {
          setListComments(result);
        }
      }
    }
  }, [newComment]);

  useEffect(() => {
    socket.on("new-topic-comment", (data) => {
      let newTopic = false;
      if (listComments.length === 0) {
        setListComments([
          ...listComments,
          {
            _id: data.topicId,
            createdAt: data.createdAt,
            data: [{ ...data }],
          },
        ]);
      } else {
        const result = listComments.map((comment) => {
          if (comment.topicId === data.topicId) {
            return [...comment.data, data];
          } else {
            newTopic = true;
            return comment;
          }
        });
        if (newTopic) {
          setListComments([
            ...listComments,
            {
              _id: data.topicId,
              createdAt: data.createdAt,
              data: [{ ...data }],
            },
          ]);
        } else {
          setListComments(result);
        }
      }
    });
  }, [listComments]);

  useEffect(() => {
    socket.on("remove-topicId", (data) => {
      console.log(listComments);
      const newList = listComments.filter(
        (comment) => comment.data[0].topicId !== data.comment.topicId
      );
      console.log(data, newList);
      setListComments(newList);
    });
  }, [listComments]);

  const getListComments = async () => {
    const result = await axios.get(
      `http://localhost:3004/topic-comments?postId=${postId}`
    );
    setListComments(result.data.data);
  };

  const RenderListComments = () => {
    return listComments.map((comment) => {
      return (
        <div
          key={Math.ceil(Math.random() * 9999999999)}
          style={{ marginTop: 10 }}
        >
          {comment.data.map((commentChild) => {
            // console.log(commentChild);
            return (
              <TopicComment
                key={Math.ceil(Math.random() * 9999999999)}
                comment={commentChild}
                handleDeleteTopic={handleDeleteTopic}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div>
      <RenderListComments />
    </div>
  );
}
