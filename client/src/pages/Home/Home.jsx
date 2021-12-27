import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import http from "./../../utils/http.js";
import News from "./News/News";

const styleMenuHeader = {
  display: "flex",
  flex: 1,
  justifyContent: "space-around",
  marginBottom: 20,
};

export default function Home() {
  const [categorys, setCategorys] = useState([]);
  const [chosenCategory, setChosenCategory] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    getCategorys();
  }, []);

  const getCategorys = async () => {
    const listCategorys = await http.get(`http://localhost:3004/categorys`);
    console.log(listCategorys);
    setCategorys(listCategorys.data);
  };

  const getChosen = (event) => {
    console.log(event.nativeEvent.target.outerText);
    // console.log(myValue); // --> 123
    setChosenCategory(event.nativeEvent.target.outerText);
  };

  const RenderCategory = () =>
    categorys.map((category, index) => (
      <MenuItem
        key={index}
        onClick={getChosen}
        // style={styleq}
      >
        {category}
      </MenuItem>
    ));

  return (
    <div>
      <div style={styleMenuHeader}>
        <RenderCategory />
      </div>
      <News chosenCategory={chosenCategory} />
    </div>
  );
}
