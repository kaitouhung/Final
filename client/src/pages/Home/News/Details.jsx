import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";

export default function Details() {
  const { state } = useLocation();
  const [des, setDes] = useState("");

  useEffect(() => {}, [des]);

  const getText = (e) => {
    // const newText = "<p id='add'>TEXT</p>";
    // setTitle(newText);
    const data = window.getSelection().toString();

    var selection = window.getSelection();
    var start = selection.anchorOffset;
    var end = selection.focusOffset;
    console.log(data);
    console.log(
      "start at postion",
      start,
      "in node",
      selection.anchorNode.wholeText
    );
    console.log(
      "stop at position",
      end,
      "in node",
      selection.focusNode.wholeText
    );
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const subStr = state.description.substring(start, end);
    setDes(
      state.description.substring(0, start) +
        `<h1 class='topic' style="background-color:#${randomColor};" >${subStr}</h1>` +
        state.description.substring(end + 1)
    );
  };

  return (
    <div className="container">
      <h1>{state.title}</h1>
      <img width={400} height="auto" src={state.image} alt="Error" />
      <p onMouseUp={getText}>{state.description}</p>
      <p dangerouslySetInnerHTML={{ __html: des }} onMouseUp={getText} />
      <p>{state.author}</p>
    </div>
  );
}
