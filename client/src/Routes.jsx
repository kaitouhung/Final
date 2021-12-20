import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { path } from './constants/path';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path={path.login} element={<Login></Login>}></Route>
      <Route path={path.register} element={<Register></Register>}></Route>
    </Routes>
  );
}
