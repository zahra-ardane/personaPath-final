// api/axiosInstance.js
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000, // Timeout in milliseconds
});

export default axiosInstance;
