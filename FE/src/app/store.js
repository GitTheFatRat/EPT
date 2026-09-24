import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import attemptReducer from '../features/attempt/attemptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attempt: attemptReducer,
  },
});
