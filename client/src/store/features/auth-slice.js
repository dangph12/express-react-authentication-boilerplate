import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import axiosInstance, { AUTH_SESSION_EXPIRED_EVENT } from '~/lib/api-client';

const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('accessToken');
};

const getStoredAccessToken = () => {
  return (
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  );
};

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    try {
      const accessToken = getStoredAccessToken();

      if (!accessToken) {
        return null;
      }

      const decoded = jwtDecode(accessToken);

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        return { accessToken, user: decoded, isExpired: true };
      }

      return { accessToken, user: decoded };
    } catch (error) {
      clearAuthTokens();
      return null;
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const handleSessionExpired = createAsyncThunk(
  'auth/handleSessionExpired',
  async (error, { dispatch }) => {
    clearAuthTokens();
    return { error };
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
    sessionExpired: false
  },
  reducers: {
    loadUser: (state, action) => {
      const { accessToken, isRemember } = action.payload;
      if (!accessToken) {
        state.user = null;
        return;
      }
      try {
        if (isRemember) {
          localStorage.setItem('accessToken', accessToken);
        } else {
          sessionStorage.setItem('accessToken', accessToken);
        }
        const decoded = jwtDecode(accessToken);
        state.user = decoded;
        state.sessionExpired = false;
      } catch (error) {
        state.user = null;
      }
    },
    clearSessionExpired: state => {
      state.sessionExpired = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          const wasInLocalStorage = localStorage.getItem('accessToken');
          if (wasInLocalStorage) {
            localStorage.setItem('accessToken', action.payload.accessToken);
          } else {
            sessionStorage.setItem('accessToken', action.payload.accessToken);
          }
        } else {
          state.user = null;
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logout.pending, state => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.sessionExpired = false;
        clearAuthTokens();
      })
      .addCase(logout.rejected, state => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.sessionExpired = false;
        clearAuthTokens();
      })
      .addCase(handleSessionExpired.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.sessionExpired = true;
        state.error = action.payload?.error?.message || 'Session expired';
      });
  }
});

export const { loadUser, clearSessionExpired } = authSlice.actions;

export const setupSessionExpiredListener = dispatch => {
  const handleSessionExpiredEvent = event => {
    dispatch(handleSessionExpired(event.detail?.error));
  };

  window.addEventListener(
    AUTH_SESSION_EXPIRED_EVENT,
    handleSessionExpiredEvent
  );

  return () => {
    window.removeEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleSessionExpiredEvent
    );
  };
};

export default authSlice.reducer;
