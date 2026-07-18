import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
});

// Async Thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build clean query string
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category) query.append('category', params.category);
      if (params.serviceArea) query.append('serviceArea', params.serviceArea);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const res = await api.get(`/services?${query.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/services/categories');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchServiceBySlug = createAsyncThunk(
  'services/fetchServiceBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await api.get(`/services/${slug}`);
      return res.data.data;
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response?.data?.message || 'Failed to fetch service details'
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch service details');
    }
  }
);

const initialState = {
  items: [],
  categories: [],
  selectedItem: null,
  loading: false,
  categoriesLoading: false,
  detailsLoading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  }
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchServices
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
      })

      // fetchServiceBySlug
      .addCase(fetchServiceBySlug.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchServiceBySlug.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchServiceBySlug.rejected, (state) => {
        state.detailsLoading = false;
      });
  }
});

export const { clearSelectedService } = servicesSlice.actions;
export default servicesSlice.reducer;
