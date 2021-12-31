import React, { useState, useEffect } from "react";
import axios from "axios";
import TheTopicComment from "./TheTopicComment";

function ListCommentTopic({ topic, comment }) {
  const [listTopicComments, setListTopicComments] = useState([]);
  useEffect(() => {
    console.log("agian");
    getTopicComments();
  }, [topic]);

  useEffect(() => {
    if (comment.content.length > 0) {
      setListTopicComments([comment, ...listTopicComments]);
    }
  }, [comment]);

  const getTopicComments = async () => {
    if (topic) {
      const result = await axios.get(
        `http://localhost:3004/topic-comments?postId=${topic.postID}&topicId=${topic._id}`
      );
      setListTopicComments(result.data.data);
    }
  };

  const RenderListTopicComment = () => {
    return listTopicComments.map((topicComment, index) => (
      <TheTopicComment
        key={topicComment._id || index}
        topicComment={topicComment}
      />
    ));
  };

  return (
    <div>
      <RenderListTopicComment />
    </div>
  );
}

export default ListCommentTopic;
