import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  stockAnalysis: null,
  comparisonData: null,
  sectorPerformance: null,
  loading: false,
  error: null,
}

// Get stock analysis
export const getStockAnalysis = createAsyncThunk(
  'analysis/getStockAnalysis',
  async ({ symbol, period = '1m' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/analysis/stocks/${symbol}?period=${period}`
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to get stock analysis'
      )
    }
  }
)

// Compare stocks
export const compareStocks = createAsyncThunk(
  'analysis/compareStocks',
  async ({ symbols, period = '1y' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/analysis/compare?symbols=${symbols.join(',')}&period=${period}`
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to compare stocks'
      )
    }
  }
)

// Get sector performance
export const getSectorPerformance = createAsyncThunk(
  'analysis/getSectorPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/analysis/sectors')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to get sector performance'
      )
    }
  }
)

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearStockAnalysis: (state) => {
      state.stockAnalysis = null
    },
    clearComparisonData: (state) => {
      state.comparisonData = null
    },
    clearAnalysisError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get stock analysis
      .addCase(getStockAnalysis.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStockAnalysis.fulfilled, (state, action) => {
        state.loading = false
        state.stockAnalysis = action.payload
      })
      .addCase(getStockAnalysis.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Compare stocks
      .addCase(compareStocks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(compareStocks.fulfilled, (state, action) => {
        state.loading = false
        state.comparisonData = action.payload
      })
      .addCase(compareStocks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get sector performance
      .addCase(getSectorPerformance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSectorPerformance.fulfilled, (state, action) => {
        state.loading = false
        state.sectorPerformance = action.payload
      })
      .addCase(getSectorPerformance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearStockAnalysis, clearComparisonData, clearAnalysisError } =
  analysisSlice.actions
export default analysisSlice.reducer
