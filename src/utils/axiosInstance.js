import axios from "axios";
import { logoutUser } from "../store/auth/actions";
import { useDispatch } from "react-redux";
import { store } from "../store/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // send access & refresh cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try refreshing the access token
        await axios.post(
          "http://localhost:4000/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Retry the original request after refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed → gracefully log user out via Redux
        store.dispatch(logoutUser());

        // Optionally, show a toast (don't force page reload)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
