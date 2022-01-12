import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import Loading from './components/Loading';
import store from './store';
import './styles/main.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Loading>
        <App />
      </Loading>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
