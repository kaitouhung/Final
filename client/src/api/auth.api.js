import Http from 'src/utils/http';

const authApi = {
  register(data) {
    return new Http(process.env.REACT_APP_API_Auth).post('signup', data);
  },
  login(data) {
    return new Http(process.env.REACT_APP_API_Auth).post('login', data);
  },
};

export default authApi;
