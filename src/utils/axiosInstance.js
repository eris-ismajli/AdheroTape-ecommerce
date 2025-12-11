import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // change for production later
  withCredentials: false, // true only if you use cookies/sessions
});

// Optional: request & response interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: attach token
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
