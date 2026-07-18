import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import servicesReducer from './slices/servicesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer
  }
});

export default store;
