import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Comment from 'src/components/Comment/Comment';
import InputTextarea from 'src/components/InputTextarea/InputTextarea';
import Http from 'src/utils/http';
import './comments.css';

const arrName = ['sasuke', 'hinata', 'minato'];
const index = Math.floor(Math.random() * 3);
const userId = arrName[index];

console.log(userId);

export default function Comments() {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const socket = useRef();
  const [visible, setVisible] = useState(5);
  const [reply, setReply] = useState(null);

  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const getReplies = (parentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === parentId)
      .sort(
        (a, b) =>
          new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
      );
  };

  const showMoreComment = () => {
    setVisible((prev) => prev + 5);
  };

  const addComment = async (text, parentId) => {
    const body = {
      userId: userId,
      parentId,
      content: text,
    };

    const commentResponse = await new Http(
      process.env.REACT_APP_API_Comment
    ).post('', body);

    socket.current.emit('add-comment', commentResponse.data);

    setBackendComments([commentResponse.data, ...backendComments]);
    setActiveComment(null);
  };

  const updateComment = async (text, commentId) => {
    const commentResponse = await new Http(
      process.env.REACT_APP_API_Comment
    ).patch(`${commentId}`, { content: text });

    socket.current.emit('update-comment', commentResponse.data);

    const index = backendComments.findIndex(
      (backendComment) => backendComment._id === commentResponse.data._id
    );

    backendComments[index].content = text;

    setBackendComments(backendComments);

    setActiveComment(null);
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('Are you sure that you want to remove comment')) {
      await new Http(process.env.REACT_APP_API_Comment).delete(`${commentId}`);

      socket.current.emit('delete-comment', commentId);

      const updateBackendComments = backendComments.filter(
        (backendComment) => backendComment._id !== commentId
      );

      setBackendComments(updateBackendComments);
    }
  };

  useEffect(() => {
    socket.current = io('ws://localhost:8900');

    socket.current.emit('join-room-postId', { postId: '1' });

    socket.current.on('new-comment', (newComment) => {
      setBackendComments((backendComments) => [newComment, ...backendComments]);
    });

    socket.current.on('delete-commentId', (commentId) => {
      setBackendComments((backendComments) =>
        backendComments.filter(
          (backendComment) => backendComment._id !== commentId
        )
      );
    });

    socket.current.on('update-newcomment', (newComment) => {
      setBackendComments((backendComments) => {
        const index = backendComments.findIndex(
          (backendComment) => backendComment._id === newComment._id
        );
        backendComments[index].content = newComment.content;

        return [...backendComments];
      });
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const commentList = await new Http(process.env.REACT_APP_API_Comment).get(
        '?postId=1'
      );

      setBackendComments(commentList.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write Comment</div>
      <InputTextarea submitLabel="Write" handleSubmit={addComment} />

      <div className="comments-container">
        {rootComments.slice(0, visible).map((rootComment) => (
          <Comment
            key={rootComment._id}
            comment={rootComment}
            replies={getReplies(rootComment._id)}
            reply={reply}
            setReply={setReply}
            currentUserId={userId}
            deleteComment={deleteComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            updateComment={updateComment}
          />
        ))}
      </div>
      {visible < rootComments.length && (
        <button className="comment-loadmore" onClick={showMoreComment}>
          Load More
        </button>
      )}
    </div>
  );
}
