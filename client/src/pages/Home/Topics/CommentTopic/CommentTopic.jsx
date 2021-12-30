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
    content: " ",
  });
  const navigation = useNavigate();

  useEffect(() => {
    socket.on("new-topic-comment", (data) => {
      console.log(data);
    });
  }, [socket]);

  const handleClick = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(topic);
    if (!topic) {
      alert("chua co topic ");
    }
    if (comment.content.length > 0) {
      console.log(comment);
      const newComments = await axios.post(
        "http://localhost:8081/api/v1/comments/topic-comments",
        comment
      );
      socket.emit("add-topic-comment", newComments.data.data);
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
      <div>
        <ListCommentTopic socket={socket} comment={comment} />
      </div>
    </div>
  );
}
