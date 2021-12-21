import http from 'src/utils/http';

const authApi = {
  register(data) {
    return http.post('signup', data);
  },
  login(data) {
    return http.post('login', data);
  },
  logout() {
    return http.post('logout');
  },
};

export default authApi;
