import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { addTransaction } from '../../store/slices/transactionSlice'
import { searchStocks } from '../../store/slices/stockSlice'

const AddTransactionForm = ({ portfolioId, onSuccess }) => {
  const dispatch = useDispatch()
  const { searchResults, loading: stocksLoading } = useSelector(
    (state) => state.stock
  )

  const [formData, setFormData] = useState({
    type: 'buy',
    symbol: '',
    name: '',
    quantity: '',
    price: '',
    date: new Date(),
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)

  // Debounce stock search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        dispatch(searchStocks(searchQuery))
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
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

  const handleStockSelect = (event, stock) => {
    setSelectedStock(stock)
    if (stock) {
      setFormData({
        ...formData,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price || '',
      })
    } else {
      setFormData({
        ...formData,
        symbol: '',
        name: '',
      })
    }
  }

  const handleSearchChange = (event, value) => {
    setSearchQuery(value)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.type) {
      newErrors.type = 'Transaction type is required'
    }

    if (!formData.symbol) {
      newErrors.symbol = 'Stock symbol is required'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setSubmitting(true)

      dispatch(
        addTransaction({
          portfolioId,
          ...formData,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
        })
      )
        .unwrap()
        .then(() => {
          onSuccess()
        })
        .catch((error) => {
          setErrors({ submit: error.message || 'Failed to add transaction' })
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={Boolean(errors.type)}>
            <InputLabel id='transaction-type-label'>
              Transaction Type
            </InputLabel>
            <Select
              labelId='transaction-type-label'
              id='type'
              name='type'
              value={formData.type}
              onChange={handleChange}
              label='Transaction Type'
            >
              <MenuItem value='buy'>Buy</MenuItem>
              <MenuItem value='sell'>Sell</MenuItem>
              <MenuItem value='dividend'>Dividend</MenuItem>
              <MenuItem value='deposit'>Deposit</MenuItem>
              <MenuItem value='withdrawal'>Withdrawal</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label='Transaction Date'
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={Boolean(errors.date)}
                helperText={errors.date}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            id='stock-search'
            options={searchResults || []}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            loading={stocksLoading}
            value={selectedStock}
            onChange={handleStockSelect}
            onInputChange={handleSearchChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Search for a stock'
                fullWidth
                error={Boolean(errors.symbol)}
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

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Quantity'
            name='quantity'
            type='number'
            value={formData.quantity}
            onChange={handleChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            inputProps={{ step: '0.0001', min: '0' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Price per Share'
            name='price'
            type='number'
            value={formData.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            inputProps={{ step: '0.01', min: '0' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Notes (optional)'
            name='notes'
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleChange}
          />
        </Grid>

        {errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{errors.submit}</FormHelperText>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='submit'
              variant='contained'
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Add Transaction'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddTransactionForm
