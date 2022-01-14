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

export default function Comments({ postId }) {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const socket = useRef();
  const [visible, setVisible] = useState(5);
  const [reply, setReply] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);
  console.log(profile);
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
        postId: postId,
      };

      const commentResponse = await new Http(
        process.env.REACT_APP_API_Comment
      ).post('', body);

      let newComment = commentResponse.data;

      newComment = {
        ...newComment,
        userId: {
          _id: newComment.userId,
          fullName: profile.fullName,
          avatar: profile.avatar,
        },
      };

      socket.current.emit('add-comment', newComment);

      setBackendComments([newComment, ...backendComments]);
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
      await new Http(process.env.REACT_APP_API_Comment).delete(`${commentId}`);

      socket.current.emit('delete-comment', commentId);

      const updateBackendComments = backendComments.filter(
        (backendComment) => backendComment._id !== commentId
      );

      setBackendComments(updateBackendComments);
    } catch (error) {
      if (error.status === 401) {
        dispatch(unauthorize());
        navigate(path.login);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    socket.current = io('ws://localhost:8900');

    socket.current.emit('join-room-postId', { postId: postId });

    socket.current.on('new-comment', (newComment) => {
      if (isMounted) {
        setBackendComments((backendComments) => [
          newComment,
          ...backendComments,
        ]);
      }
    });

    socket.current.on('delete-commentId', (commentId) => {
      if (isMounted) {
        setBackendComments((backendComments) =>
          backendComments.filter(
            (backendComment) => backendComment._id !== commentId
          )
        );
      }
    });

    socket.current.on('update-newcomment', (newComment) => {
      if (isMounted) {
        setBackendComments((backendComments) => {
          const index = backendComments.findIndex(
            (backendComment) => backendComment._id === newComment._id
          );
          backendComments[index].content = newComment.content;

          return [...backendComments];
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let unmounted = false;

    const fetchData = async () => {
      try {
        const commentList = await new Http(process.env.REACT_APP_API_Query).get(
          `?postId=${postId}`
        );

        if (!unmounted) {
          setBackendComments(commentList.data);
        }
      } catch (error) {
        toast.error(error.message, {
          position: 'top-right',
          autoClosse: 4000,
        });
      }
    };

    fetchData();

    return () => {
      unmounted = true;
    };
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
