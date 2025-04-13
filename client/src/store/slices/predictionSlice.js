import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  prediction: null,
  loading: false,
  error: null,
}

// Get stock prediction
export const getStockPrediction = createAsyncThunk(
  'prediction/getStockPrediction',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/predictions/stocks/${symbol}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to get stock prediction'
      )
    }
  }
)

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    clearPrediction: (state) => {
      state.prediction = null
    },
    clearPredictionError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStockPrediction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getStockPrediction.fulfilled, (state, action) => {
        state.loading = false
        state.prediction = action.payload
      })
      .addCase(getStockPrediction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPrediction, clearPredictionError } = predictionSlice.actions
export default predictionSlice.reducer
