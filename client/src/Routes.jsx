import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import { path } from './constants/path';
import AuthenticatedGuard from './guards/AuthenticatedGuard';
import UnauthenticatedGuard from './guards/UnauthenticatedGuard';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Comments from './pages/Comments/Comments';
import Home from './pages/Home/Home';
import Details from './pages/Home/News/Details';
import NotFound from './pages/NotFound/NotFound';
import User from './pages/User/User';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route
        path={path.login}
        element={
          <UnauthenticatedGuard>
            <Login />
          </UnauthenticatedGuard>
        }
      ></Route>
      <Route
        path={path.register}
        element={
          <UnauthenticatedGuard>
            <Register />
          </UnauthenticatedGuard>
        }
      ></Route>

      <Route path={path.home} element={<Home></Home>}></Route>
      <Route path="/news-details/:id" element={<Details></Details>}></Route>

      <Route path={path.comments} element={<Comments></Comments>}></Route>
      <Route
        path={path.users}
        element={
          <AuthenticatedGuard>
            <User />
          </AuthenticatedGuard>
        }
      ></Route>
      <Route path="/headers" element={<Header></Header>}></Route>
      <Route path={path.notFound} element={<NotFound></NotFound>}></Route>
    </Routes>
  );
}
