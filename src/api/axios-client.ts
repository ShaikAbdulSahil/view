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

// Log detailed error info for failed requests to help debugging 500s
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Only log in non-production to avoid leaking sensitive info
//     if (process.env.NODE_ENV !== 'production') {
//       try {
//         const cfg = error?.config || {};
//         console.error('Axios request failed:', {
//           url: cfg.url,
//           method: cfg.method,
//           data: cfg.data,
//           params: cfg.params,
//           headers: cfg.headers,
//           status: error?.response?.status,
//           responseData: error?.response?.data,
//         });
//       } catch (e) {
//         console.error('Failed to log axios error details', e);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default axiosClient;
