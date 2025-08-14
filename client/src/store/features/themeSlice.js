import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: localStorage.getItem('theme') || 'light'
  },
  reducers: {
    toggleTheme: state => {
      state.value = state.value === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('class', state.value);
      localStorage.setItem('theme', state.value);
    }
  }
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
