import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function TheTopicComment({ topicComment }) {
  return (
    <div
      style={{
        margin: 10,
        padding: 10,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 15,
        backgroundColor: "rgba(0, 0, 0, 0.08)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", marginBottom: 10 }}>
        <Avatar alt="binh" style={{ width: 25, height: 25, marginRight: 20 }} />
        <Typography
          variant="body1"
          style={{ color: "black", fontWeight: "bold" }}
        >
          {topicComment.userData.fullName}
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
        <Typography variant="body1" style={{ color: "black", fontWeight: 400 }}>
          {topicComment.content}
        </Typography>
      </div>
    </div>
  );
}

export default TheTopicComment;
