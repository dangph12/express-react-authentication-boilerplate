import axios from 'axios';

const refreshTokenClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true
});

export const REFRESH_TOKEN_ERROR = {
  EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  INVALID: 'REFRESH_TOKEN_INVALID',
  MISSING: 'REFRESH_TOKEN_MISSING',
  NETWORK: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

const getRefreshTokenErrorCode = error => {
  if (!error.response) {
    return REFRESH_TOKEN_ERROR.NETWORK;
  }

  const { status, data } = error.response;
  const message = data?.message?.toLowerCase() || '';

  if (status === 401) {
    if (message.includes('expired')) {
      return REFRESH_TOKEN_ERROR.EXPIRED;
    }
    if (message.includes('required') || message.includes('missing')) {
      return REFRESH_TOKEN_ERROR.MISSING;
    }
    return REFRESH_TOKEN_ERROR.INVALID;
  }

  if (status === 400 && message.includes('invalid')) {
    return REFRESH_TOKEN_ERROR.INVALID;
  }

  return REFRESH_TOKEN_ERROR.UNKNOWN;
};

export const refreshAccessToken = async () => {
  try {
    const response = await refreshTokenClient.post(
      '/api/auth/refresh-access-token'
    );

    const { status, message, data } = response.data;

    if (status === 'success' && data?.accessToken) {
      return {
        accessToken: data.accessToken,
        message
      };
    }

    throw {
      code: REFRESH_TOKEN_ERROR.UNKNOWN,
      message: message || 'Failed to refresh access token'
    };
  } catch (error) {
    if (error.code && Object.values(REFRESH_TOKEN_ERROR).includes(error.code)) {
      throw error;
    }

    const code = getRefreshTokenErrorCode(error);
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to refresh access token';

    throw {
      code,
      message,
      isRefreshTokenError: true
    };
  }
};

export const isRefreshTokenExpired = error => {
  return error?.code === REFRESH_TOKEN_ERROR.EXPIRED;
};

export const requiresReAuthentication = error => {
  return [
    REFRESH_TOKEN_ERROR.EXPIRED,
    REFRESH_TOKEN_ERROR.INVALID,
    REFRESH_TOKEN_ERROR.MISSING
  ].includes(error?.code);
};
