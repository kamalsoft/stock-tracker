import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  preferences: null,
  loading: false,
  error: null,
}

// Get user preferences
export const getUserPreferences = createAsyncThunk(
  'preferences/getUserPreferences',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      }
      const response = await axios.get('/api/preferences', config)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to get user preferences'
      )
    }
  }
)

// Update user preferences
export const updateUserPreferences = createAsyncThunk(
  'preferences/updateUserPreferences',
  async (preferencesData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      }
      const response = await axios.put(
        '/api/preferences',
        preferencesData,
        config
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || 'Failed to update user preferences'
      )
    }
  }
)

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    clearPreferencesError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user preferences
      .addCase(getUserPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.loading = false
        state.preferences = action.payload
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update user preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false
        state.preferences = action.payload
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPreferencesError } = preferencesSlice.actions
export default preferencesSlice.reducer
