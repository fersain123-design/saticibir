import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('vendor');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/api/vendor/register', data),
  login: (email: string, password: string) => api.post('/api/vendor/login', { email, password }),
  logout: () => api.post('/api/vendor/logout'),
  getMe: () => api.get('/api/vendor/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/api/vendor/change-password', { current_password: currentPassword, new_password: newPassword }),
};

// Vendor API
export const vendorAPI = {
  getProfile: () => api.get('/api/vendor/profile'),
  updateProfile: (data: any) => api.put('/api/vendor/profile', data),
  updateWorkingHours: (data: any) => api.put('/api/vendor/working-hours', data),
  getDocuments: () => api.get('/api/vendor/documents'),
  uploadDocument: (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);
    return api.post('/api/vendor/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: (period?: string) => api.get('/api/vendor/dashboard', { params: { period } }),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/api/vendor/products', { params }),
  getOne: (id: string) => api.get(`/api/vendor/products/${id}`),
  create: (data: any) => api.post('/api/vendor/products', data),
  update: (id: string, data: any) => api.put(`/api/vendor/products/${id}`, data),
  delete: (id: string) => api.delete(`/api/vendor/products/${id}`),
  getCategories: () => api.get('/api/vendor/products/categories'),
};

// Orders API
export const ordersAPI = {
  getAll: (params?: any) => api.get('/api/vendor/orders', { params }),
  getOne: (id: string) => api.get(`/api/vendor/orders/${id}`),
  updateStatus: (id: string, status: string, note?: string) =>
    api.put(`/api/vendor/orders/${id}/status`, { status, note }),
};

export default api;
