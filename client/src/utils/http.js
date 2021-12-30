import axios from "axios";
import { toast } from "react-toastify";
import LocalStorage from "src/constants/localStorage";

class Http {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.response.use(
      (response) => {
        const result = { ...response.data, status: response.status };
        return result;
      },
      (error) => {
        if (error.response.status === 401) {
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 3000,
          });
        }
        const result = {
          ...error.response.data,
          status: error.response.status,
        };
        return Promise.reject(result);
      }
    );
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem(LocalStorage.accessToken);
        if (accessToken) {
          config.headers.authorization = accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error.response);
      }
    );
  }
  get(url, config = null) {
    return this.instance.get(url, config);
  }
  post(url, data, config = null) {
    return this.instance.post(url, data, config);
  }
  put(url, data, config = null) {
    return this.instance.put(url, data, config);
  }
  patch(url, data, config = null) {
    return this.instance.patch(url, data, config);
  }
  delete(url, data, config = null) {
    return this.instance.delete(url, {
      data,
      ...config,
    });
  }
}

// const http = new Http();
export default Http;
