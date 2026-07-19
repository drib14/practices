import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import bookingReducer from './slices/bookingSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer
  }
});
