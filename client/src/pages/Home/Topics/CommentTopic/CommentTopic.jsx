import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListCommentTopic from "./ListCommentTopic";
import axios from "axios";

// const socket = io.connect("http://localhost:8900");
export default function CommentTopic({ topic, socket }) {
  const [comment, setComment] = useState({
    postId: "",
    topicId: "",
    userId: "",
    parentId: "",
    content: "",
    userData: {},
  });
  const [finalComment, setFinalComment] = useState({
    postId: "",
    topicId: "",
    userId: "",
    parentId: "",
    content: "",
    userData: {},
  });
  const navigation = useNavigate();

  useEffect(() => {
    socket.on("new-topic-comment", (data) => {
      setFinalComment(data);
      console.log(data);
    });
  }, [finalComment]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!topic) {
      alert("chua co topic ");
    }
    if (comment.content.length > 0) {
      const user = JSON.parse(localStorage.getItem("user"));
      setFinalComment(comment);
      const newComments = await axios.post(
        "http://localhost:8081/api/v1/comments/topic-comments",
        comment
      );
      socket.emit("add-topic-comment", {
        ...newComments.data.data,
        userData: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      });
    }
  };

  const handleChangeText = (e) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigation("/login");

    setComment({
      postId: topic.postID,
      topicId: topic._id,
      userId: user._id,
      parentId: null,
      content: e.target.value,
      userData: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  };

  return (
    <div>
      {topic.content ? <p>{topic.content}</p> : <br />}
      <div>
        <input type="text" onChange={handleChangeText} />
        <button type="submit" onClick={handleClick}>
          Send
        </button>
      </div>
      <div style={{ height: "40vh", overflow: "auto" }}>
        <ListCommentTopic
          socket={socket}
          comment={finalComment}
          topic={topic}
        />
      </div>
    </div>
  );
}
