import React from "react";

function TheTopicComment() {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Avatar alt="binh" style={{ width: 25, height: 25 }} />
        <Typography
          variant="body1"
          style={{ color: "black", fontWeight: "bold" }}
        >
          {"comment.user.name"}
        </Typography>
      </div>
      <div style={{ margin: "auto", padding: "10px 0px" }}>
        <Typography variant="body1" style={{ color: "black", fontWeight: 400 }}>
          {"comment.content"}
        </Typography>
      </div>
    </div>
  );
}

export default TheTopicComment;
