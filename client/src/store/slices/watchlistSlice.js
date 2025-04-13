import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Fetch watchlist
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/watchlist')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch watchlist'
      )
    }
  }
)

// Add stock to watchlist
export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/watchlist', stockData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to watchlist'
      )
    }
  }
)

// Remove stock from watchlist
export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (symbol, { rejectWithValue }) => {
    try {
      await api.delete(`/api/watchlist/${symbol}`)
      return symbol
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from watchlist'
      )
    }
  }
)

const initialState = {
  watchlist: [],
  loading: false,
  success: false,
  error: null,
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    clearWatchlistError: (state) => {
      state.error = null
    },
    resetWatchlistSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch watchlist
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false
        state.watchlist = action.payload
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add to watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.watchlist.push(action.payload)
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Remove from watchlist
      .addCase(removeFromWatchlist.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.watchlist = state.watchlist.filter(
          (stock) => stock.symbol !== action.payload
        )
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearWatchlistError, resetWatchlistSuccess } =
  watchlistSlice.actions

export default watchlistSlice.reducer
