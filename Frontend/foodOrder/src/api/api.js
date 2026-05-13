import axios from "axios";

// Base URLs for different services
export const USER_SERVICE_URL = "http://172.29.48.1:8081/api";
export const FOOD_SERVICE_URL = "http://172.29.48.1:8082";
export const ORDER_SERVICE_URL = "http://172.29.48.1:8083"; // Assuming port for order service
export const PAYMENT_SERVICE_URL = "http://172.29.48.1:8084";

// Create axios instance
const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (Logout user if needed)
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
