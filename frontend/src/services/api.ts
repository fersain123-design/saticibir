import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API - Using existing backend endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    apiClient.post('/api/vendor/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  
  getMe: () => 
    apiClient.get('/api/vendor/me'),
};

// Vendor API
export const vendorAPI = {
  getProfile: () => 
    apiClient.get('/api/vendor/profile'),
  
  updateProfile: (data: any) => 
    apiClient.put('/api/vendor/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => 
    apiClient.get('/api/vendor/products', { params }),
  
  getById: (id: string) => 
    apiClient.get(`/api/vendor/products/${id}`),
  
  create: (data: any) => 
    apiClient.post('/api/vendor/products', data),
  
  update: (id: string, data: any) => 
    apiClient.put(`/api/vendor/products/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/vendor/products/${id}`),
  
  // Image upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/vendor/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Bulk image upload
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return apiClient.post('/api/vendor/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: (params?: any) => 
    apiClient.get('/api/vendor/orders', { params }),
  
  getById: (id: string) => 
    apiClient.get(`/api/vendor/orders/${id}`),
  
  updateStatus: (id: string, status: string, note?: string) => 
    apiClient.put(`/api/vendor/orders/${id}/status`, { status, note }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => 
    apiClient.get('/api/vendor/dashboard'),
};

// Multi-Channel API
export const multiChannelAPI = {
  getChannels: () => 
    apiClient.get('/api/vendor/channels'),
  
  activateChannel: (channelId: string, data: any) => 
    apiClient.post(`/api/vendor/channels/${channelId}/activate`, data),
  
  deactivateChannel: (channelId: string) => 
    apiClient.post(`/api/vendor/channels/${channelId}/deactivate`),
};

// Inventory/Smart Stock API
export const inventoryAPI = {
  getAlerts: () => 
    apiClient.get('/api/vendor/inventory/alerts'),
  
  getPredictions: () => 
    apiClient.get('/api/vendor/inventory/predictions'),
  
  getTrends: () => 
    apiClient.get('/api/vendor/inventory/trends'),
};

export default apiClient;
