import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '~/lib/api-client';

export const fetchAvatar = createAsyncThunk(
  'avatar/fetchAvatar',
  async userId => {
    if (!userId) return null;
    const response = await axiosInstance.get(`/api/users/me`);
    return response.data.data.avatar;
  }
);

export const updateAvatar = createAsyncThunk(
  'avatar/updateAvatar',
  async ({ file }) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.patch(`/api/users/me`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data.avatar;
  }
);

export const avatarSlice = createSlice({
  name: 'avatar',
  initialState: {
    url: null,
    uploading: false
  },
  reducers: {
    setAvatar: (state, action) => {
      state.url = action.payload;
    },
    clearAvatar: state => {
      state.url = null;
      state.uploading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAvatar.fulfilled, (state, action) => {
        state.url = action.payload;
      })
      .addCase(updateAvatar.pending, state => {
        state.uploading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.url = action.payload;
        state.uploading = false;
      })
      .addCase(updateAvatar.rejected, state => {
        state.uploading = false;
      });
  }
});

export const { setAvatar, clearAvatar } = avatarSlice.actions;

export default avatarSlice.reducer;
