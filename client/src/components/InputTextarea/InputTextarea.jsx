import React, { useState } from 'react';

export default function InputTextarea({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  initialText = '',
  handleCancel,
  setReply,
  commentId,
  parent,
}) {
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text.length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text);
    setText('');
    if (parent) {
      commentId = parent._id;
    }

    setReply({
      _id: commentId,
      status: true,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
