import axios from 'axios';
import { STORAGE_KEYS, getItem, removeItem } from '../utils/storage';

const API_BASE_URL =
  import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      removeItem(STORAGE_KEYS.TOKEN);
      removeItem(STORAGE_KEYS.USER);
      if (typeof onUnauthorized === 'function') onUnauthorized();
    }
    return Promise.reject(error);
  }
);

