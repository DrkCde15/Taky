import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth-storage'));
  const token = auth?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
