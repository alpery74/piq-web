import axios from 'axios';

const API_BASE_URL = 'https://piq-2025-8fc430488343.herokuapp.com/api';
const AUTH_TOKEN_KEY = 'authToken';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const storeToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);
export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export default client;
