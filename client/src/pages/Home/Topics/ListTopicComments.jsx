import React, { useEffect, useState } from "react";
import axios from "axios";
import TopicComment from "./TopicComment";
import AddTopicComment from "./AddTopicComment";

export default function ListTopicComments({
  postId,
  socket,
  newComment,
  handleRemoveTopic,

  //new
  content,
  handleAfterCreateTopicComment,
  handleUpdateNewsContent,
  description,
  handleSendComment,
}) {
  const [listComments, setListComments] = useState([]);
  const [topicId, setTopicId] = useState("");

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

  const handleDeleteTopicComment = async (comment) => {
    const result = listComments.map((topic) => ({
      ...topic,
      data: topic.data.filter((commentData) => commentData._id !== comment._id),
    }));
    console.log(comment, result);

    await axios.delete(
      `http://localhost:8081/api/v1/comments/a-comment-of-topic/${comment._id}`
    );

    socket.emit("remove-topic-comment", result);

    setListComments(result);
  };

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
        let newTopic = true;
        const result = listComments.map((comment) => {
          if (comment.data[0].topicId === newComment.topicId) {
            newTopic = false;
            return { ...comment, data: [...comment.data, newComment] };
          } else {
            // newTopic = true;
            return comment;
          }
        });
        console.log(result);
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
      let newTopic = true;
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
          if (comment.data[0].topicId === data.topicId) {
            newTopic = false;
            // return { ...comment, data: [...comment.data, newComment] };
            return { ...comment, data: [...comment.data, data] };
          } else {
            // newTopic = true;
            return comment;
          }
        });
        console.log(result);
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

  useEffect(() => {
    socket.on("remove-topic-comment-id", (data) => {
      console.log(data);
      setListComments(data);
    });
  }, [listComments]);

  const getListComments = async () => {
    const result = await axios.get(
      `http://localhost:3004/topic-comments?postId=${postId}`
    );
    setListComments(result.data.data);
  };

  // const handleClose = () => {
  //   setCreate(false);
  // };
  // const handleOpen = () => {
  //   setCreate(true);
  // };

  const RenderListComments = () => {
    return listComments.map((comment) => {
      return (
        <div
          key={Math.ceil(Math.random() * 9999999999)}
          style={{ marginTop: 20, marginRight: 20 }}
          onClick={() => {
            setTopicId(comment.data[0].topicId);
          }}
        >
          {comment.data.map((commentChild, index) => {
            if (index > 0) commentChild.topicContent = "";
            return (
              <TopicComment
                key={Math.ceil(Math.random() * 9999999999)}
                comment={commentChild}
                handleDeleteTopic={handleDeleteTopic}
                handleDeleteTopicComment={handleDeleteTopicComment}
              />
            );
          })}
          <div>
            <AddTopicComment
              postId={postId}
              create={true}
              content={content}
              handleAfterCreateTopicComment={handleAfterCreateTopicComment}
              handleUpdateNewsContent={handleUpdateNewsContent}
              description={description}
              socket={socket}
              handleSendComment={handleSendComment}
              topicId={topicId}
              type="rep-comment-topic"
            />
          </div>
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
