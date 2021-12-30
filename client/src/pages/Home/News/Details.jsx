import { Grid } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Topic from "../Topics/Topic";
import Alert from "./Alert";
import "./style.css";
import axios from "axios";

export default function Details() {
  const { state } = useLocation();
  // const [des, setDes] = useState("");
  const [chooseTopic, setChooseTopic] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState({});
  const [newTopic, setNewTopic] = useState({});

  const getText = (e) => {
    var selection = window.getSelection();
    var start = selection.anchorOffset;
    var end = selection.focusOffset;
    setIndex({ start, end });
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const subStr = state.description.substring(start, end);
    setChooseTopic(subStr);
    setOpen(true);
    // setDes(
    //   state.description.substring(0, start) +
    //     `<h1 class='topic' style="background-color:#${randomColor};" >${subStr}</h1>` +
    //     state.description.substring(end + 1)
    // );
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAgreed = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const result = await axios.post(
      "http://localhost:3003/topic/create-topic",
      {
        postID: state._id,
        userID: user._id,
        index,
        content: chooseTopic,
      }
    );
    setNewTopic(result.data);
    setOpen(false);
  };

  return (
    <div className="container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>{state.title}</h1>
          <img width={400} height="auto" src={state.image} alt="Error" />
          <p onMouseUp={getText}>{state.description}</p>
          {/* <p dangerouslySetInnerHTML={{}}></p> */}
          <p>{state.author}</p>
        </Grid>

        <Grid item xs={6}>
          <Topic topic={newTopic} postID={state._id} />
        </Grid>
      </Grid>
      {open && (
        <Alert
          topic={chooseTopic}
          open={open}
          handleClose={handleClose}
          handleAgreed={handleAgreed}
        />
      )}
    </div>
  );
}
