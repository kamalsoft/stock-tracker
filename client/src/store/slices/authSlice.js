import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import logger from '../../utils/logger'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      logger.time('API - Login')
      const response = await api.post('/api/auth/login', credentials)
      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('token', token)

      logger.timeEnd('API - Login')
      return user
    } catch (error) {
      logger.error('Login failed', error)
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      logger.time('API - Register')
      const response = await api.post('/api/auth/register', userData)
      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('token', token)

      logger.timeEnd('API - Register')
      return user
    } catch (error) {
      logger.error('Registration failed', error)
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token')
      return null
    } catch (error) {
      logger.error('Logout failed', error)
      return rejectWithValue('Logout failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      logger.time('API - Get current user')
      const response = await api.get('/api/auth/user')
      logger.timeEnd('API - Get current user')
      return response.data
    } catch (error) {
      logger.error('Failed to get current user', error)
      // If unauthorized, clear token
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user data'
      )
    }
  }
)

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
      })

      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload || 'Failed to get user data'
      })
  },
})

export const { clearAuthError, resetAuthState } = authSlice.actions

export default authSlice.reducer
