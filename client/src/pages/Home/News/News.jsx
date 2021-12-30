import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";

export default function News({ chosenCategory }) {
  const navigate = useNavigate();
  const [listNews, setListNews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    getListNews(chosenCategory, 1);
  }, [chosenCategory]);

  const getListNews = async (category, page) => {
    const result = await axios.get(
      `http://localhost:3004/posts?category=${category}&&page=${page}`
    );
    setListNews(result.data.data);
    setTotalPages(result.totalPages);
  };

  const handleDetail = (news) => {
    console.log("Asdasdasd", news);
    navigate(`/news-details/${news._id}`, {
      state: { ...news },
    });
  };

  const handleChangePage = (event, value) => {
    getListNews(chosenCategory, value);
  };

  const RenderNews = () =>
    listNews.map((news, index) => (
      <div key={index} style={newsStyle}>
        <img width={200} height="auto" src={news.image} alt="Error" />
        <h3 style={titleStyle} onClick={() => handleDetail(news)}>
          {news.title}
        </h3>
      </div>
    ));

  return (
    <div>
      <RenderNews />
      <Pagination
        onChange={handleChangePage}
        count={totalPages}
        color="primary"
      />
    </div>
  );
}

const newsStyle = {
  display: "flex",
  margin: 20,
};

const titleStyle = {
  cursor: "pointer",
  margin: 20,
  textDecoration: "underline",
};
