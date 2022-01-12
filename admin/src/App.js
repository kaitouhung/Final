import React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { path } from './constants/path';
import AddPost from './pages/admin/AddPost';
import AdminCommon from './pages/admin/AdminCommon';
import Order from './pages/admin/Order';
import UserList from './pages/admin/UserList';
import Login from './pages/Auth/Login/Login';
import { authentication } from './pages/authentication';
import Common from './pages/Common';
import Customer from './pages/Customer';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <BrowserRouter>
        <RouteWrapper exact path="/" component={Home} layout={Common} />
        <RouteWrapper path="/customer" component={Customer} layout={Common} />

        <RouteWrapper path="/admin" component={UserList} layout={AdminCommon} />
        <RouteWrapper path="/order" component={Order} layout={AdminCommon} />
        <RouteWrapper
          path="/add-post"
          component={AddPost}
          layout={AdminCommon}
        />

        <Route path={path.login}>
          <Login />
        </Route>
        {/* <Route path={path.register}>
          <Register />
        </Route> */}
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

function RouteWrapper({ component: Component, layout: Layout, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}

function PrivateRoute({ component: Component, layout: Layout, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authentication.isAuthentication() ? (
          <Layout {...props}>
            <Component {...props} />
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

function PrivateRoute2({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authentication.isAuthentication() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default App;