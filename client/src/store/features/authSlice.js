import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import axiosInstance from '~/lib/axiosInstance';

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async () => {
    try {
      let accessToken =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');

      if (!accessToken) {
        const response = await axiosInstance.post(
          '/api/auth/refresh-access-token'
        );
        accessToken = response.data.data.accessToken;
      }

      const decoded = jwtDecode(accessToken);
      return { accessToken, user: decoded };
    } catch (error) {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      return null;
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null
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
      } catch (error) {
        state.user = null;
      }
    },
    removeUser: state => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
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
      });
  }
});

export const { loadUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
