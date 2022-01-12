import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MenuRight from "src/components/Menu/MenuRight";
import ButtonAnswer from "./ButtonAnswer";

export default function TopicComment({ comment, handleDeleteTopic }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(comment);
  return (
    <div
      style={{
        // margin: 10,
        padding: 10,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{ flex: 9 }}>
        <div
          style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}
        >
          <Avatar
            alt="binh"
            style={{ width: 25, height: 25, marginRight: 20 }}
          />
          <Typography
            variant="body1"
            style={{ color: "black", fontWeight: "bold" }}
          >
            {comment.userData.fullName}
          </Typography>
        </div>
        <div
          style={{
            margin: "auto",
            marginLeft: 10,
            marginRight: 10,
            padding: "10px 20px",
            backgroundColor: "white",
            borderRadius: 15,
          }}
        >
          <Typography
            variant="body1"
            style={{ color: "black", fontWeight: 400 }}
          >
            {comment.content}
          </Typography>
        </div>
        <ButtonAnswer />
      </div>
      <div style={{ flex: 1 }}>
        {comment.userData._id === user._id && (
          <MenuRight
            options={["Xóa"]}
            handleDeleteTopic={handleDeleteTopic}
            comment={comment}
          />
        )}
      </div>
    </div>
  );
}
