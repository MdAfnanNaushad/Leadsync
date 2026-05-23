import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
    (config)=>{
        const activeSessionToken = localStorage.getItem('leadsync_jwt_token');
        if(activeSessionToken&& config.headers){
            config.headers.Authorization = `Bearer ${activeSessionToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server drops a session request due to validation expiries, force clear states
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('leadsync_jwt_token');
      localStorage.removeItem('leadsync_user_profile');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);