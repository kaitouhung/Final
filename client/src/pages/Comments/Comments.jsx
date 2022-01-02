import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import Comment from 'src/components/Comment/Comment';
import InputTextarea from 'src/components/InputTextarea/InputTextarea';
import { path } from 'src/constants/path';
import Http from 'src/utils/http';
import { unauthorize } from '../Auth/auth.slice';
import './comments.css';

export default function Comments() {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const socket = useRef();
  const [visible, setVisible] = useState(5);
  const [reply, setReply] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);
  const userId = profile?._id || null;

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
    try {
      const body = {
        // userId: userId,
        parentId,
        content: text,
      };

      const commentResponse = await new Http(
        process.env.REACT_APP_API_Comment
      ).post('', body);

      socket.current.emit('add-comment', commentResponse.data);

      setBackendComments([commentResponse.data, ...backendComments]);
      setActiveComment(null);
    } catch (error) {
      if (error.status === 401) {
        dispatch(unauthorize());
        navigate(path.login);
      }
    }
  };

  const updateComment = async (text, commentId) => {
    try {
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
    } catch (error) {
      if (error.status === 401) {
        dispatch(unauthorize());
        navigate(path.login);
      }
    }
  };

  const deleteComment = async (commentId) => {
    try {
      if (window.confirm('Are you sure that you want to remove comment')) {
        await new Http(process.env.REACT_APP_API_Comment).delete(
          `${commentId}`
        );

        socket.current.emit('delete-comment', commentId);

        const updateBackendComments = backendComments.filter(
          (backendComment) => backendComment._id !== commentId
        );

        setBackendComments(updateBackendComments);
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(unauthorize());
        navigate(path.login);
      }
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
      try {
        const commentList = await new Http(process.env.REACT_APP_API_Query).get(
          '?postId=1'
        );

        setBackendComments(commentList.data);
      } catch (error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClosse: 4000,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write Comment</div>
      <InputTextarea
        submitLabel="Write"
        handleSubmit={addComment}
        setReply={setReply}
      />

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
