import { configureStore } from '@reduxjs/toolkit';

import authReducer from '~/store/features/auth-slice';
import avatarReducer from '~/store/features/avatar-slice';
import themeReducer from '~/store/features/theme-slice';

export default configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    avatar: avatarReducer
  }
});
