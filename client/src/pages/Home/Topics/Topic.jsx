import React, { useState } from "react";
import AddTopicComment from "./AddTopicComment";
import ListTopicComments from "./ListTopicComments";

function Topic({
  postId,
  create,
  content,
  handleAfterCreateTopicComment,
  handleUpdateNewsContent,
  description,
  socket,
  handleRemoveTopic,
}) {
  const [comment, setComment] = useState({});

  const handleSendComment = (data) => {
    setComment(data);
  };

  return (
    <div style={{ marginLeft: 100 }}>
      {create && (
        <AddTopicComment
          postId={postId}
          create={create}
          content={content}
          handleAfterCreateTopicComment={handleAfterCreateTopicComment}
          handleUpdateNewsContent={handleUpdateNewsContent}
          description={description}
          socket={socket}
          handleSendComment={handleSendComment}
          type="new-topic"
          topicId=""
        />
      )}
      <ListTopicComments
        postId={postId}
        socket={socket}
        newComment={comment}
        content={content}
        handleRemoveTopic={handleRemoveTopic}
        handleAfterCreateTopicComment={handleAfterCreateTopicComment}
        handleUpdateNewsContent={handleUpdateNewsContent}
        description={description}
        socket={socket}
        handleSendComment={handleSendComment}
      />
    </div>
  );
}

export default Topic;
