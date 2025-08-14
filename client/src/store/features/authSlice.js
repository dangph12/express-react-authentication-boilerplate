import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null
  },
  reducers: {
    loadUser: (state, action) => {
      console.log('loadUser action payload:', action.payload);
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
        console.error('Failed to decode access token:', error);
        state.user = null;
      }
    },
    removeUser: state => {
      state.user = null;
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
    }
  }
});

export const { loadUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
