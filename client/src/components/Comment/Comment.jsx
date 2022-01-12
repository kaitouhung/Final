import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
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
  parent,
}) {
  // const timePassed = new Date() - new Date(comment.createdAt) > 300000;
  // const canReply = Boolean(currentUserId);
  // const canModify = currentUserId === comment.userId._id && !timePassed;
  const canModify = currentUserId === comment.userId._id;

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

  const avatar =
    comment.userId.avatar ||
    'https://res.cloudinary.com/mern-itachi/image/upload/v1641222036/users/hxc8yfsq3eb92efff7vs.png';

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="comment">
      <div className="comment-image-container">
        <img src={avatar} alt="" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author"> {comment.userId.fullName}</div>
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
            commentId={comment._id}
            parent={parent}
          />
        )}
        <div className="comment-actions">
          {/* {canReply && (
            <div
              className="comment-action"
              onClick={() => {
                setActiveComment({
                  _id: comment._id,
                  type: 'replying',
                });
                // setReply({
                //   _id: comment._id,
                //   status: true,
                // });
              }}
            >
              Reply
            </div>
          )} */}
          <div
            className="comment-action"
            onClick={() => {
              setActiveComment({
                _id: comment._id,
                type: 'replying',
              });
              // setReply({
              //   _id: comment._id,
              //   status: true,
              // });
            }}
          >
            Reply
          </div>
          {canModify && (
            <div
              className="comment-action"
              onClick={() => {
                setActiveComment({
                  _id: comment._id,
                  type: 'editing',
                });
                // setReply({
                //   _id: comment._id,
                //   status: true,
                // });
              }}
            >
              Edit
            </div>
          )}
          {canModify && (
            <div
              className="comment-action"
              // onClick={() => deleteComment(comment._id)}
              onClick={handleClickOpen}
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
            parent={parent}
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
                parent={comment}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          disableEscapeKeyDown
          // onBackdropClick={handleClickOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Remove Comment</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure that you want to remove comment
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={() => deleteComment(comment._id)} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
