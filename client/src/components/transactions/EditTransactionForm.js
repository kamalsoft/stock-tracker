import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Autocomplete,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { updateTransaction } from '../../store/slices/transactionSlice'
import { searchStocks } from '../../store/slices/stockSlice'

const transactionTypes = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'dividend', label: 'Dividend' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
]

const EditTransactionForm = ({ transaction, portfolioId, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.transaction)
  const { searchResults, loading: stocksLoading } = useSelector(
    (state) => state.stock
  )

  const [formData, setFormData] = useState({
    type: transaction.type || 'buy',
    symbol: transaction.symbol || '',
    shares: transaction.shares || '',
    price: transaction.price || '',
    total: transaction.total || '',
    date: transaction.date ? new Date(transaction.date) : new Date(),
    notes: transaction.notes || '',
  })
  const [errors, setErrors] = useState({})
  const [stockInput, setStockInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  // Debounce stock search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(stockInput)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [stockInput])

  // Search stocks when debounced input changes
  useEffect(() => {
    if (debouncedInput && debouncedInput.length >= 2) {
      dispatch(searchStocks(debouncedInput))
    }
  }, [debouncedInput, dispatch])

  // Initial search for the current stock
  useEffect(() => {
    if (transaction.symbol) {
      dispatch(searchStocks(transaction.symbol))
    }
  }, [dispatch, transaction.symbol])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.type) {
      newErrors.type = 'Transaction type is required'
    }

    if (
      ['buy', 'sell', 'dividend'].includes(formData.type) &&
      !formData.symbol
    ) {
      newErrors.symbol = 'Stock symbol is required'
    }

    if (['buy', 'sell'].includes(formData.type)) {
      if (!formData.shares || formData.shares <= 0) {
        newErrors.shares = 'Number of shares must be greater than 0'
      }

      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'Price must be greater than 0'
      }
    }

    if (!formData.total || formData.total <= 0) {
      newErrors.total = 'Total amount must be greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Update form data
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      }

      // Calculate total when shares or price changes
      if (
        ['buy', 'sell'].includes(newData.type) &&
        (name === 'shares' || name === 'price')
      ) {
        const shares = parseFloat(newData.shares) || 0
        const price = parseFloat(newData.price) || 0
        newData.total = (shares * price).toFixed(2)
      }

      return newData
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    })

    if (errors.date) {
      setErrors({
        ...errors,
        date: '',
      })
    }
  }

  const handleStockChange = (event, newValue) => {
    if (newValue) {
      setFormData({
        ...formData,
        symbol: newValue.symbol,
      })

      if (errors.symbol) {
        setErrors({
          ...errors,
          symbol: '',
        })
      }
    } else {
      setFormData({
        ...formData,
        symbol: '',
      })
    }
  }

  const handleStockInputChange = (event, newInputValue) => {
    setStockInput(newInputValue)
  }

  const handleTotalChange = (e) => {
    const total = e.target.value

    setFormData({
      ...formData,
      total,
    })

    if (errors.total) {
      setErrors({
        ...errors,
        total: '',
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const transactionData = {
        ...formData,
        id: transaction.id,
        portfolioId,
        shares: parseFloat(formData.shares) || 0,
        price: parseFloat(formData.price) || 0,
        total: parseFloat(formData.total) || 0,
      }

      dispatch(updateTransaction(transactionData)).then((result) => {
        if (!result.error) {
          onClose()
        }
      })
    }
  }

  const needsSymbol = ['buy', 'sell', 'dividend'].includes(formData.type)
  const needsSharesAndPrice = ['buy', 'sell'].includes(formData.type)

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            required
            fullWidth
            id='type'
            label='Transaction Type'
            name='type'
            value={formData.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
          >
            {transactionTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label='Transaction Date'
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                error={!!errors.date}
                helperText={errors.date}
              />
            )}
          />
        </Grid>

        {needsSymbol && (
          <Grid item xs={12}>
            <Autocomplete
              id='symbol'
              options={searchResults || []}
              getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
              loading={stocksLoading}
              onInputChange={handleStockInputChange}
              onChange={handleStockChange}
              value={
                searchResults.find(
                  (stock) => stock.symbol === formData.symbol
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Stock Symbol'
                  required
                  error={!!errors.symbol}
                  helperText={errors.symbol}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stocksLoading ? (
                          <CircularProgress color='inherit' size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        )}

        {needsSharesAndPrice && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='shares'
                label='Number of Shares'
                name='shares'
                type='number'
                inputProps={{ step: '0.01' }}
                value={formData.shares}
                onChange={handleChange}
                error={!!errors.shares}
                helperText={errors.shares}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='price'
                label='Price per Share'
                name='price'
                type='number'
                inputProps={{ step: '0.01' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id='total'
            label='Total Amount'
            name='total'
            type='number'
            inputProps={{ step: '0.01' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            value={formData.total}
            onChange={handleTotalChange}
            error={!!errors.total}
            helperText={errors.total}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id='notes'
            label='Notes'
            name='notes'
            multiline
            rows={2}
            value={formData.notes}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button type='submit' variant='contained' disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  )
}

export default EditTransactionForm
