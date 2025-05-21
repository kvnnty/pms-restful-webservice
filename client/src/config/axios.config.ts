import { API_URL } from "@/lib/api";
import { store } from "@/store";
import axios, { type AxiosError, type AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 600000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
