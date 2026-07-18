import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchWorkers = createAsyncThunk(
  'workers/fetchWorkers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/workers`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workers');
    }
  }
);

export const fetchWorkerById = createAsyncThunk(
  'workers/fetchWorkerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/workers/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch worker');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'workers/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/workers/categories`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const workerSlice = createSlice({
  name: 'workers',
  initialState: {
    items: [],
    categories: [],
    selectedItem: null,
    loading: false,
    categoriesLoading: false,
    error: null,
    meta: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  },
  reducers: {
    clearSelectedWorker: (state) => {
      state.selectedItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workers
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Worker By ID
      .addCase(fetchWorkerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload.data;
      })
      .addCase(fetchWorkerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSelectedWorker } = workerSlice.actions;
export default workerSlice.reducer;
