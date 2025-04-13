import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import { updatePortfolio } from '../../store/slices/portfolioSlice'

const EditPortfolioDialog = ({ open, onClose, portfolio }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.portfolio)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [formErrors, setFormErrors] = useState({})

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CHF', label: 'Swiss Franc (Fr)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
  ]

  useEffect(() => {
    if (portfolio) {
      setName(portfolio.name || '')
      setDescription(portfolio.description || '')
      setCurrency(portfolio.currency || 'USD')
    }
  }, [portfolio])

  const validateForm = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = 'Portfolio name is required'
    } else if (name.length > 50) {
      errors.name = 'Portfolio name must be less than 50 characters'
    }

    if (description && description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }

    if (!currency) {
      errors.currency = 'Currency is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !portfolio) return

    const portfolioData = {
      id: portfolio.id,
      name: name.trim(),
      description: description.trim(),
      currency,
    }

    const resultAction = await dispatch(updatePortfolio(portfolioData))

    if (updatePortfolio.fulfilled.match(resultAction)) {
      onClose()
    }
  }

  const handleClose = () => {
    setFormErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Portfolio Name'
            type='text'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            sx={{ mb: 2 }}
          />

          <TextField
            margin='dense'
            id='description'
            label='Description (Optional)'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={Boolean(formErrors.description)}
            helperText={formErrors.description}
            sx={{ mb: 2 }}
          />

          <FormControl
            fullWidth
            error={Boolean(formErrors.currency)}
            sx={{ mb: 2 }}
          >
            <InputLabel id='currency-label'>Currency</InputLabel>
            <Select
              labelId='currency-label'
              id='currency'
              value={currency}
              label='Currency'
              onChange={(e) => setCurrency(e.target.value)}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {formErrors.currency && (
              <FormHelperText>{formErrors.currency}</FormHelperText>
            )}
          </FormControl>

          {error && (
            <Typography color='error' variant='body2' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditPortfolioDialog
