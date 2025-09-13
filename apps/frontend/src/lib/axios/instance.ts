import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : process.env.NEXT_PUBLIC_BASE_URL;

export const baseApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);
