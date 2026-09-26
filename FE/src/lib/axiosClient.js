import axios from 'axios';
import { store } from '../app/store.js';
import { setAuth, logout } from '../features/auth/authSlice.js';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
axiosClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is TOKEN_EXPIRED and we haven't retried yet
    if (
      error.response?.status === 401 &&
      error.response?.data?.error?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (refreshToken) {
        try {
          // Attempt to refresh
          const res = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const newAccessToken = res.data.data.accessToken;

          // Update Redux state with new access token (keep existing user and refreshToken)
          store.dispatch(
            setAuth({
              accessToken: newAccessToken,
              refreshToken: refreshToken, // keep existing
              user: state.auth.user, // keep existing
            })
          );

          // Update original request header and retry
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, log out user
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, log out
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
