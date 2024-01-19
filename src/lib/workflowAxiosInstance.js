// api/workflowAxiosInstance.js
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_WORKFLOW_API_BASE_URL;

const workflowAxiosInstance = axios.create({
  baseURL,
  timeout: 5000, // Timeout in milliseconds
});

export default workflowAxiosInstance;
