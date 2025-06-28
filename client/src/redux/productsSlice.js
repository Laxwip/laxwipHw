import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Traer todos los productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get('https://laxwiphw.onrender.com/allIndiceFormat');
    return response.data;
  }
);

// Buscar productos
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query) => {
    const response = await axios.get(`https://laxwiphw.onrender.com/buscarProducto?q=${encodeURIComponent(query)}`);
    return response.data;
  }
);

// Obtener producto por ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await axios.get(`https://laxwiphw.onrender.com/producto/${id}`);
    return response.data;
  }
);

// Eliminar producto por ID
export const deleteProductById = createAsyncThunk(
  'products/deleteProductById',
  async (id) => {
    await axios.delete(`https://laxwiphw.onrender.com/eliminarProducto/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    homepageItems: [],
    searchResults: [],
    selectedProduct: null,
    status: 'idle',
    searchStatus: 'idle',
    deleteStatus: 'idle',
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
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.homepageItems = action.payload.filter(
          (item) => item.disponibilidad.toLowerCase() === 'disponible'
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // searchProducts
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

      // fetchProductById
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })

      // deleteProductById
      .addCase(deleteProductById.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const id = action.payload;
        state.items = state.items.filter((item) => item.id !== id);
        state.searchResults = state.searchResults.filter((item) => item.id !== id);
        state.homepageItems = state.homepageItems.filter((item) => item.id !== id);
        if (state.selectedProduct?.id === id) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults } = productsSlice.actions;
export default productsSlice.reducer;
