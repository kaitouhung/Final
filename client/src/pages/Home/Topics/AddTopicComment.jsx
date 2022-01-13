import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function AddTopicComment({
  type,
  postId,
  create,
  content,
  handleAfterCreateTopicComment,
  description,
  handleUpdateNewsContent,
  socket,
  handleSendComment,
  topicId,
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!content) handleAfterCreateTopicComment();
  }, [content]);

  const handleChangeText = (e) => {
    setComment(e.target.value);
  };

  const handleSend = async () => {
    if (comment) {
      const result =
        type === "new-topic"
          ? await axios.post("http://localhost:3003/topic/create-topic", {
              postID: postId,
              userID: user._id,
              content,
            })
          : { data: { data: { _id: topicId } } };
      console.log(1231321, topicId, result.data.data._id);

      const newComments = await axios.post(
        "http://localhost:8081/api/v1/comments/topic-comments",
        {
          postId: postId,
          topicId: result.data.data._id,
          userId: user._id,
          parentId: null,
          content: comment,
          userData: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
          },
        }
      );

      type === "new-topic" && handleUpdateNewsContent(description);
      handleSendComment({
        ...newComments.data.data,
        userData: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
        },
        topicContent: content,
      });
      socket.emit("add-topic-comment", {
        ...newComments.data.data,
        userData: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
        },
        topicContent: content,
      });
      setComment("");
      type === "new-topic" && handleAfterCreateTopicComment();
    }
  };

  return (
    <div>
      {create && (
        <div
          style={{
            // margin: 10,
            padding: 10,
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 15,
            backgroundColor: "rgba(0, 0, 0, 0.08)",
          }}
        >
          {type === "new-topic" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Avatar
                alt="binh"
                style={{ width: 25, height: 25, marginRight: 20 }}
              />
              <Typography
                variant="body1"
                style={{ color: "black", fontWeight: "bold" }}
              >
                {user.fullName}
              </Typography>
            </div>
          ) : (
            <></>
          )}
          <div>
            <TextField
              style={{
                margin: "auto",
                marginLeft: 10,
                marginRight: 10,
                backgroundColor: "white",
                borderRadius: 15,
              }}
              id="outlined-basic"
              autoComplete="off"
              variant="outlined"
              placeholder="Viết nhận xét"
              onChange={handleChangeText}
              value={comment}
            />
          </div>
          <div style={{ marginLeft: 10, marginTop: 15, paddingBottom: 5 }}>
            <Button
              style={{ fontSize: 10, fontWeight: "bold" }}
              variant="outlined"
              onClick={handleSend}
            >
              Nhận xét
            </Button>
            <Button
              style={{ fontSize: 10, fontWeight: "bold" }}
              variant="outlined"
              onClick={handleAfterCreateTopicComment}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
