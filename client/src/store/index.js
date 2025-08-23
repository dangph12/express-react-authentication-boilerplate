import { configureStore } from '@reduxjs/toolkit';

import authReducer from '~/store/features/authSlice';
import avatarReducer from '~/store/features/avatarSlice';
import themeReducer from '~/store/features/themeSlice';

export default configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    avatar: avatarReducer
  }
});
