import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'
import logger from '../../utils/logger'

// Async thunks
export const fetchUserPortfolios = createAsyncThunk(
  'portfolio/fetchUserPortfolios',
  async (_, { rejectWithValue }) => {
    try {
      logger.time('API - Fetch portfolios')
      const response = await api.get('/api/portfolios')
      logger.timeEnd('API - Fetch portfolios')
      return response.data
    } catch (error) {
      logger.error('Failed to fetch portfolios', error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch portfolios'
      )
    }
  }
)

// Export with the name the Dashboard component is expecting
export const fetchPortfolios = fetchUserPortfolios

export const fetchPortfolioById = createAsyncThunk(
  'portfolio/fetchPortfolioById',
  async (portfolioId, { rejectWithValue }) => {
    try {
      logger.time(`API - Fetch portfolio ${portfolioId}`)
      const response = await api.get(`/api/portfolios/${portfolioId}`)
      logger.timeEnd(`API - Fetch portfolio ${portfolioId}`)
      return response.data
    } catch (error) {
      logger.error(`Failed to fetch portfolio ${portfolioId}`, error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch portfolio'
      )
    }
  }
)

export const createPortfolio = createAsyncThunk(
  'portfolio/createPortfolio',
  async (portfolioData, { rejectWithValue }) => {
    try {
      logger.time('API - Create portfolio')
      const response = await api.post('/api/portfolios', portfolioData)
      logger.timeEnd('API - Create portfolio')
      return response.data
    } catch (error) {
      logger.error('Failed to create portfolio', error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create portfolio'
      )
    }
  }
)

export const updatePortfolio = createAsyncThunk(
  'portfolio/updatePortfolio',
  async ({ id, portfolioData }, { rejectWithValue }) => {
    try {
      logger.time(`API - Update portfolio ${id}`)
      const response = await api.put(`/api/portfolios/${id}`, portfolioData)
      logger.timeEnd(`API - Update portfolio ${id}`)
      return response.data
    } catch (error) {
      logger.error(`Failed to update portfolio ${id}`, error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update portfolio'
      )
    }
  }
)

export const deletePortfolio = createAsyncThunk(
  'portfolio/deletePortfolio',
  async (portfolioId, { rejectWithValue }) => {
    try {
      logger.time(`API - Delete portfolio ${portfolioId}`)
      await api.delete(`/api/portfolios/${portfolioId}`)
      logger.timeEnd(`API - Delete portfolio ${portfolioId}`)
      return portfolioId
    } catch (error) {
      logger.error(`Failed to delete portfolio ${portfolioId}`, error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete portfolio'
      )
    }
  }
)

// Initial state
const initialState = {
  portfolios: [],
  currentPortfolio: null,
  loading: false,
  error: null,
}

// Slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearPortfolioError: (state) => {
      state.error = null
    },
    resetPortfolioState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch user portfolios
      .addCase(fetchUserPortfolios.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserPortfolios.fulfilled, (state, action) => {
        state.loading = false
        state.portfolios = action.payload
      })
      .addCase(fetchUserPortfolios.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch portfolios'
      })

      // Fetch portfolio by ID
      .addCase(fetchPortfolioById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolioById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPortfolio = action.payload
      })
      .addCase(fetchPortfolioById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch portfolio'
      })

      // Create portfolio
      .addCase(createPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.portfolios.push(action.payload)
      })
      .addCase(createPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create portfolio'
      })

      // Update portfolio
      .addCase(updatePortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePortfolio.fulfilled, (state, action) => {
        state.loading = false
        const index = state.portfolios.findIndex(
          (p) => p.id === action.payload.id
        )
        if (index !== -1) {
          state.portfolios[index] = action.payload
        }
        if (
          state.currentPortfolio &&
          state.currentPortfolio.id === action.payload.id
        ) {
          state.currentPortfolio = action.payload
        }
      })
      .addCase(updatePortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update portfolio'
      })

      // Delete portfolio
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.portfolios = state.portfolios.filter(
          (p) => p.id !== action.payload
        )
        if (
          state.currentPortfolio &&
          state.currentPortfolio.id === action.payload
        ) {
          state.currentPortfolio = null
        }
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete portfolio'
      })
  },
})

export const { clearPortfolioError, resetPortfolioState } =
  portfolioSlice.actions

export default portfolioSlice.reducer
