import axios from 'axios';

import { isPublicEndpoint } from '~/config/paths';
import {
  refreshAccessToken,
  requiresReAuthentication
} from '~/features/auth/refresh-access-token/api/refresh-access-token';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

const dispatchSessionExpired = error => {
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { error }
    })
  );
};

const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('accessToken');
};

const saveAccessToken = accessToken => {
  const wasInLocalStorage = localStorage.getItem('accessToken');
  if (wasInLocalStorage !== null) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    sessionStorage.setItem('accessToken', accessToken);
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  config => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry;
    const isPublic = isPublicEndpoint(originalRequest.url);

    if (!isUnauthorized || alreadyRetried || isPublic) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { accessToken } = await refreshAccessToken();

      saveAccessToken(accessToken);
      processQueue(null, accessToken);

      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      if (requiresReAuthentication(refreshError)) {
        clearAuthTokens();
        dispatchSessionExpired(refreshError);
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
