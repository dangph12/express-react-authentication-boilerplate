import { configureStore } from '@reduxjs/toolkit';

import authReducer from '~/store/features/authSlice';
import themeReducer from '~/store/features/themeSlice';

export default configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer
  }
});
