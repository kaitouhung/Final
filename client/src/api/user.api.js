import Http from 'src/utils/http';

const userApi = {
  updateMe(data) {
    return new Http(process.env.REACT_APP_API_Auth).patch('update-user', data);
  },
  uploadAvatar(data) {
    return new Http(
      process.env.REACT_APP_API_Auth,
      'multipart/form-data'
    ).patch('upload-avatar', data);
  },
};

export default userApi;
