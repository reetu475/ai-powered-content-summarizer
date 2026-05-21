import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const contentAPI = {
  processText: (data) => api.post('/content/text', data),
  processUrl: (data) => api.post('/content/url', data),
  processFile: (formData) => api.post('/content/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export const summaryAPI = {
  generate: (data) => api.post('/summary/generate', data),
  getHistory: (params) => api.get('/summary/history', { params }),
  getSummary: (id) => api.get(`/summary/${id}`),
  deleteSummary: (id) => api.delete(`/summary/${id}`),
  search: (query) => api.get('/summary/search', { params: { query } })
};

export default api;
