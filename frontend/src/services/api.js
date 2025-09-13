import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
};

// Store API calls
export const storeAPI = {
  getAllStores: (params) => api.get('/stores', { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (storeData) => api.post('/stores', storeData),
  updateStore: (id, storeData) => api.put(`/stores/${id}`, storeData),
  deleteStore: (id) => api.delete(`/stores/${id}`),
};

// Rating API calls
export const ratingAPI = {
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  getUserRatings: (params) => api.get('/ratings/user', { params }),
  getStoreRatings: (storeId, params) => api.get(`/ratings/store/${storeId}`, { params }),
  deleteRating: (id) => api.delete(`/ratings/${id}`),
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Store Owner API calls
export const storeOwnerAPI = {
  getOwnerStore: () => api.get('/store-owner/store'),
  getStoreRatings: (params) => api.get('/store-owner/store/ratings', { params }),
};

export default api;
