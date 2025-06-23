import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Trae todos los productos desde tu backend
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get('https://laxwiphw.onrender.com/allIndiceFormat');
    return response.data;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query) => {
    const response = await axios.get(`https://laxwiphw.onrender.com/buscarProducto?q=${encodeURIComponent(query)}`);
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await axios.get(`https://laxwiphw.onrender.com/producto/${id}`);
    return response.data;
  }
);



const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    homepageItems: [],
    searchResults: [],
    status: 'idle',
    searchStatus: 'idle',     // Nuevo estado solo para búsqueda
    error: null,
    searchError: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        // Filtrar solo los disponibles para homepage
        state.homepageItems = action.payload.filter(
          (item) => item.disponibilidad.toLowerCase() === 'disponible'
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.searchError = action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      });
  },
});

export default productsSlice.reducer;
