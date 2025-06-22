import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Trae todos los productos desde tu backend
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get('http://localhost:3000/allIndiceFormat');
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],           // Todos los productos
    homepageItems: [],   // Solo los disponibles
    status: 'idle',
    error: null,
  },
  reducers: {},
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
      });
  },
});

export default productsSlice.reducer;
