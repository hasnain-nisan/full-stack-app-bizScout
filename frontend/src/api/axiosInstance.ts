import axios from 'axios';

const axiosInstance = axios.create({
   // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
   // baseURL: `http://localhost:3000/api`,
   baseURL: `https://full-stack-app-bizscout.onrender.com/api`,
   timeout: 1000000000, // Timeout after 10 seconds
   headers: {
      'Content-Type': 'application/json',
   },
});

// Optional: Add request interceptors
axiosInstance.interceptors.request.use(
   (config) => {
      console.log(`Request made to ${config.url}`);
      return config;
   },
   (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
   }
);

// Optional: Add response interceptors
axiosInstance.interceptors.response.use(
   (response) => response,
   (error) => {
      console.error('Response error:', error.response || error.message);
      return Promise.reject(error);
   }
);

export default axiosInstance;
