import axios from 'axios';
import { getToken } from '../utils/storage';

const axiosClient = axios.create({
  // baseURL: 'https://doctor-appointment-5j6e.onrender.com',
  baseURL: 'https://mydent-api.onrender.com',
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

export default axiosClient;
