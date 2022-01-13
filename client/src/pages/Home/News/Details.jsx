import { Grid } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Header from 'src/components/Header/Header';
import Comments from 'src/pages/Comments/Comments';
import Topic from '../Topics/Topic';
import ButtonHandle from './ButtonHandle';
import './style.css';

const socket = io.connect('http://localhost:8900');

export default function Details() {
  const { state } = useLocation();
  const [des, setDes] = useState('');
  const [description, setDescription] = useState('');
  const [chooseTopic, setChooseTopic] = useState('');
  const [create, setCreate] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    socket.emit('join-room-postId', { postId: state._id });
  }, [socket]);

  useEffect(() => {
    socket.on('new-topic', (data) => {
      setDes(data.data);
    });
  }, [des]);

  const getText = (e) => {
    var selection = window.getSelection();
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    setChooseTopic(selection.toString());
    const start = (des || state.description).indexOf(selection.toString());
    const end = start + selection.toString().length;

    const newHtml =
      (des || state.description).slice(0, start) +
      `<p style="background-color: #${randomColor}" class='topic'>` +
      (des || state.description).slice(start, end) +
      '</p>' +
      (des || state.description).slice(end);

    setDescription(newHtml);
  };

  const handleUnderlineTopic = (contentData) => {
    let result = (des || state.description).replace(
      /; text-decoration: underline;/g,
      ''
    );

    const start = result.indexOf(contentData) - 16;
    const end = start + 16 + contentData.length;

    const newHtml =
      result.slice(0, start) +
      `; text-decoration: underline;` +
      result.slice(start, end) +
      result.slice(end);
    setDes(newHtml);
  };

  const handleClickToDescription = () => {
    let result = (des || state.description).replace(
      /; text-decoration: underline;/g,
      ""
    );
    setDes(result);
  };

  const handleUpdateNewsContent = async (data) => {
    await axios.put(`http://localhost:3001/update-post/${state._id}`, {
      description: data,
    });
    setDes(data);
    socket.emit('add-topic', {
      data,
    });
  };

  const handleRemoveTopic = async (content) => {
    const start = (des || state.description).indexOf(content);
    const end = start + content.length;
    const newHtml =
      (des || state.description).slice(0, start - 51) +
      content +
      (des || state.description).slice(end + 4);
    // console.log(des, state.description);
    // console.log(content, start, end, newHtml);
    setDes(newHtml);
    handleUpdateNewsContent(newHtml);
  };

  const handleCreateTopicComment = () => {
    setCreate(true);
  };
  const handleAfterCreateTopicComment = () => {
    setCreate(false);
    setChooseTopic('');
  };

  return (
    <div>
      <Header />
      <Grid container spacing={2}>
        <div className="button-border">
          {chooseTopic.length > 0 && (
            <ButtonHandle handleCreateTopicComment={handleCreateTopicComment} />
          )}
        </div>
        <Grid item xs={7}>
          <h1>{state.title}</h1>
          <img width={400} height="auto" src={state.image} alt="Error" />
          <p
            onMouseUp={getText}
            dangerouslySetInnerHTML={{ __html: des || state.description }}
            onClick={handleClickToDescription}
          />
          <p>{state.author}</p>
        </Grid>
        <Grid item xs={5}>
          {user && (
            <Topic
              postId={state._id}
              create={create}
              content={chooseTopic}
              handleAfterCreateTopicComment={handleAfterCreateTopicComment}
              handleUpdateNewsContent={handleUpdateNewsContent}
              description={description}
              socket={socket}
              handleRemoveTopic={handleRemoveTopic}
              handleUnderlineTopic={handleUnderlineTopic}
            />
          )}
        </Grid>
      </Grid>

      <Comments postId={state._id} />
    </div>
  );
}
