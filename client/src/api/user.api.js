import Http from 'src/utils/http';

const userApi = {
  updateMe() {
    return new Http(process.env.REACT_APP_API_Auth).patch('update-user');
  },
};

export default userApi;
