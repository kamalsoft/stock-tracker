import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Fetch recent transactions
export const fetchRecentTransactions = createAsyncThunk(
  'transaction/fetchRecentTransactions',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions/recent?limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recent transactions'
      )
    }
  }
)

// Fetch transactions by portfolio ID
export const fetchTransactionsByPortfolio = createAsyncThunk(
  'transaction/fetchTransactionsByPortfolio',
  async (portfolioId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/portfolios/${portfolioId}/transactions`
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch portfolio transactions'
      )
    }
  }
)

// Fetch transactions by stock symbol
export const fetchTransactionsBySymbol = createAsyncThunk(
  'transaction/fetchTransactionsBySymbol',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/transactions/symbol/${symbol}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stock transactions'
      )
    }
  }
)

// Add a new transaction
export const addTransaction = createAsyncThunk(
  'transaction/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/transactions', transactionData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add transaction'
      )
    }
  }
)

// Update a transaction
export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, ...transactionData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/transactions/${id}`, transactionData)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update transaction'
      )
    }
  }
)

// Delete a transaction
export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/transactions/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete transaction'
      )
    }
  }
)

const initialState = {
  recentTransactions: [],
  portfolioTransactions: [],
  symbolTransactions: [],
  loading: false,
  success: false,
  error: null,
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null
    },
    resetTransactionSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recent transactions
      .addCase(fetchRecentTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
        state.loading = false
        if (state.recentTransactions) state.recentTransactions = action.payload
      })
      .addCase(fetchRecentTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch transactions by portfolio
      .addCase(fetchTransactionsByPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionsByPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.portfolioTransactions = action.payload
      })
      .addCase(fetchTransactionsByPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch transactions by symbol
      .addCase(fetchTransactionsBySymbol.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionsBySymbol.fulfilled, (state, action) => {
        state.loading = false
        state.symbolTransactions = action.payload
      })
      .addCase(fetchTransactionsBySymbol.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.recentTransactions = [
          action.payload,
          ...state.recentTransactions,
        ].slice(0, 10)
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.success = true

        // Update in recent transactions
        const recentIndex = state.recentTransactions.findIndex(
          (t) => t.id === action.payload.id
        )
        if (recentIndex !== -1) {
          state.recentTransactions[recentIndex] = action.payload
        }

        // Update in portfolio transactions
        const portfolioIndex = state.portfolioTransactions.findIndex(
          (t) => t.id === action.payload.id
        )
        if (portfolioIndex !== -1) {
          state.portfolioTransactions[portfolioIndex] = action.payload
        }

        // Update in symbol transactions
        const symbolIndex = state.symbolTransactions.findIndex(
          (t) => t.id === action.payload.id
        )
        if (symbolIndex !== -1) {
          state.symbolTransactions[symbolIndex] = action.payload
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.success = true

        // Remove from recent transactions
        state.recentTransactions = state.recentTransactions.filter(
          (t) => t.id !== action.payload
        )

        // Remove from portfolio transactions
        state.portfolioTransactions = state.portfolioTransactions.filter(
          (t) => t.id !== action.payload
        )

        // Remove from symbol transactions
        state.symbolTransactions = state.symbolTransactions.filter(
          (t) => t.id !== action.payload
        )
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearTransactionError, resetTransactionSuccess } =
  transactionSlice.actions

export default transactionSlice.reducer
