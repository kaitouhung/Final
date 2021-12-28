import React from "react";
import { Route, Routes } from "react-router-dom";
import { path } from "./constants/path";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Home from "./pages/Home/Home";
import Details from "./pages/Home/News/Details";

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path={path.login} element={<Login></Login>}></Route>
      <Route path={path.register} element={<Register></Register>}></Route>
      <Route path={path.home} element={<Home></Home>}></Route>
      <Route path="/news-details/:id" element={<Details></Details>}></Route>
    </Routes>
  );
}
