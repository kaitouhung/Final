import React, { useState, useEffect } from "react";

export default function TopicItem({ topic, chooseATopic, closeATopic }) {
  const clickTopic = async () => {
    chooseATopic();
  };

  return (
    <div>
      <li
        // key={index}
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={clickTopic}
      >
        {topic.content}
      </li>
    </div>
  );
}
