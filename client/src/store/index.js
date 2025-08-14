import { configureStore } from '@reduxjs/toolkit';

import themeReducer from '~/store/features/themeSlice';

export default configureStore({
  reducer: {
    theme: themeReducer
  }
});
