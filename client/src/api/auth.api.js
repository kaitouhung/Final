import Http from 'src/utils/http';

const authApi = {
  register(data) {
    return new Http(process.env.REACT_APP_API_Auth).post('signup', data);
  },
  login(data) {
    return new Http(process.env.REACT_APP_API_Auth).post('login', data);
  },
  forgot(data) {
    return new Http(process.env.REACT_APP_API_Auth).post(
      'forgotpassword',
      data
    );
  },
  reset(id, data) {
    return new Http(process.env.REACT_APP_API_Auth).patch(
      `resetPassword/${id}`,
      data
    );
  },
};

export default authApi;
