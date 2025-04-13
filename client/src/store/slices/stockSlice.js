import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Fetch stock details
export const fetchStockDetails = createAsyncThunk(
  'stock/fetchStockDetails',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/stocks/${symbol}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stock details'
      )
    }
  }
)

// Fetch stock price history
export const fetchStockHistory = createAsyncThunk(
  'stock/fetchStockHistory',
  async ({ symbol, range = '1M' }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/stocks/${symbol}/history?range=${range}`
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stock history'
      )
    }
  }
)

// Search stocks
export const searchStocks = createAsyncThunk(
  'stock/searchStocks',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/stocks/search?q=${query}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search stocks'
      )
    }
  }
)

// Fetch trending stocks
export const fetchTrendingStocks = createAsyncThunk(
  'stock/fetchTrendingStocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/stocks/trending')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trending stocks'
      )
    }
  }
)

const initialState = {
  stockDetails: null,
  stockHistory: [],
  searchResults: [],
  trendingStocks: [],
  loading: false,
  error: null,
}

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clearStockError: (state) => {
      state.error = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stock details
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false
        state.stockDetails = action.payload
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch stock history
      .addCase(fetchStockHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.loading = false
        state.stockHistory = action.payload
      })
      .addCase(fetchStockHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Search stocks
      .addCase(searchStocks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch trending stocks
      .addCase(fetchTrendingStocks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrendingStocks.fulfilled, (state, action) => {
        state.loading = false
        state.trendingStocks = action.payload
      })
      .addCase(fetchTrendingStocks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearStockError, clearSearchResults } = stockSlice.actions

export default stockSlice.reducer
