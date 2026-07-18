import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import workerReducer from './slices/workerSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workers: workerReducer
  }
});
