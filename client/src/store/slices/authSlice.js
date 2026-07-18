import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';
import Swal from 'sweetalert2';

// Custom premium Toast alerts configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Async Thunks
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/profile');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Session load error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { usernameOrEmail, password });
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      });
      return res.data.user;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      Toast.fire({
        icon: 'error',
        title: errorMsg
      });
      return rejectWithValue(errorMsg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/auth/register', payload);
      Swal.fire({
        icon: 'success',
        title: 'Welcome to FixConnect!',
        text: 'Account created successfully. Logging you in...',
        timer: 2000,
        showConfirmButton: false
      });
      
      const loginResult = await dispatch(loginUser({
        usernameOrEmail: payload.username,
        password: payload.password
      })).unwrap();
      
      return loginResult;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      Toast.fire({
        icon: 'error',
        title: errorMsg
      });
      return rejectWithValue(errorMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      Toast.fire({
        icon: 'success',
        title: 'Signed out successfully'
      });
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Logout failed');
    }
  }
);

export const logoutAllUser = createAsyncThunk(
  'auth/logoutAllUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout-all');
      Toast.fire({
        icon: 'success',
        title: 'Signed out from all devices'
      });
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Logout all failed');
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  'auth/forgotPasswordUser',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'info',
        title: 'Check Your Inbox',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Request failed';
      Toast.fire({
        icon: 'error',
        title: errorMsg
      });
      return rejectWithValue(errorMsg);
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  'auth/resetPasswordUser',
  async ({ email, code, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/reset-password', { email, code, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Reset Complete',
        text: res.data.message,
        confirmButtonColor: '#0f172a'
      });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Reset failed';
      Toast.fire({
        icon: 'error',
        title: errorMsg
      });
      return rejectWithValue(errorMsg);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isInitialized: false
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkSession
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
      })
      
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // logoutAllUser
      .addCase(logoutAllUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
