import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

// Configure response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 && 
      error.response?.data?.code === 'TOKEN_EXPIRED' && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired',
          text: 'Your security session has expired. Please log in again.',
          confirmButtonColor: '#0f172a'
        }).then(() => {
          window.location.href = '/';
        });
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
