import axios from 'axios';
import { getToken } from '../utils/storage';

const axiosClient = axios.create({
  // baseURL: 'https://doctor-appointment-5j6e.onrender.com',
  baseURL: 'https://mydent-api.onrender.com',
  timeout: 15000,
});

// Attach token from storage to each request
axiosClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  // console.log('1. Innrerceptor running for url:', config.url);
  // console.log('2. Token found in storage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('No token found in storage.');
  }
  return config;
});

// Log detailed error info for failed requests to help debugging network issues
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const cfg = error?.config || {};
      const payload = {
        url: cfg.baseURL ? cfg.baseURL + (cfg.url || '') : cfg.url,
        method: cfg.method,
        timeout: cfg.timeout,
        data: cfg.data,
        params: cfg.params,
        status: error?.response?.status,
        responseData: error?.response?.data,
        message: error?.message,
        code: error?.code,
      };
      console.error('Axios request failed:', payload);
    } catch (e) {
      console.error('Failed to log axios error details', e);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
