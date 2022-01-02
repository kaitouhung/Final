import React from 'react';
import Avatar from 'src/assets/img/user-icon.png';
import { format } from 'timeago.js';
import InputTextarea from '../InputTextarea/InputTextarea';

export default function Comment({
  comment,
  replies,
  currentUserId,
  deleteComment,
  activeComment,
  addComment,
  setActiveComment,
  parentId = null,
  updateComment,
  reply,
  setReply,
}) {
  const timePassed = new Date() - new Date(comment.createdAt) > 300000;
  const canReply = Boolean(currentUserId);
  const canModify = currentUserId === comment.userId && !timePassed;
  const createdAt = format(comment.createdAt);

  const isReplying =
    activeComment &&
    activeComment.type === 'replying' &&
    activeComment._id === comment._id;

  const isEditing =
    activeComment &&
    activeComment.type === 'editing' &&
    activeComment._id === comment._id;

  const replyId = parentId ? parentId : comment._id;

  const isView = reply && reply._id === comment._id && reply.status === true;

  return (
    <div className="comment">
      <div className="comment-image-container">
        <img src={Avatar} alt="" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author"> {comment.fullName}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className="comment-text">{comment.content}</div>}
        {isEditing && (
          <InputTextarea
            submitLabel="Update"
            hasCancelButton
            initialText={comment.content}
            handleSubmit={(text) => updateComment(text, comment._id)}
            handleCancel={() => setActiveComment(null)}
            setReply={setReply}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({
                  _id: comment._id,
                  type: 'replying',
                })
              }
            >
              Reply
            </div>
          )}
          {canModify && (
            <div
              className="comment-action"
              onClick={() =>
                setActiveComment({
                  _id: comment._id,
                  type: 'editing',
                })
              }
            >
              Edit
            </div>
          )}
          {canModify && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment._id)}
            >
              Delete
            </div>
          )}
        </div>

        {isReplying && (
          <InputTextarea
            submitLabel="Reply"
            hasCancelButton
            handleCancel={() => setActiveComment(null)}
            handleSubmit={(text) => addComment(text, replyId)}
            setReply={setReply}
            commentId={comment._id}
          />
        )}

        {replies.length > 0 && !isView && (
          <div
            className="comment-viewmore"
            onClick={() =>
              setReply({
                _id: comment._id,
                status: true,
              })
            }
          >
            View more {replies.length} comment
          </div>
        )}
        {replies.length > 0 && isView && (
          <div
            className="comment-viewmore"
            onClick={() =>
              setReply({
                _id: comment._id,
                status: false,
              })
            }
          >
            Hide {replies.length} comment
          </div>
        )}

        {replies.length > 0 && isView && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply._id}
                replies={[]}
                currentUserId={currentUserId}
                deleteComment={deleteComment}
                parentId={comment._id}
                addComment={addComment}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                updateComment={updateComment}
                setReply={setReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
