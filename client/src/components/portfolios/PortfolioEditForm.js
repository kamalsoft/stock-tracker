import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  TextField,
  Button,
  Grid,
  InputAdornment,
  FormHelperText,
} from '@mui/material'
import { updatePortfolio } from '../../store/slices/portfolioSlice'

const PortfolioEditForm = ({ portfolio, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: portfolio.name || '',
    description: portfolio.description || '',
    cashBalance: portfolio.cashBalance || 0,
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Portfolio name is required'
    }

    if (isNaN(formData.cashBalance) || formData.cashBalance < 0) {
      newErrors.cashBalance = 'Cash balance must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'cashBalance' ? parseFloat(value) || 0 : value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      dispatch(
        updatePortfolio({
          id: portfolio.id,
          portfolioData: formData,
        })
      ).then((result) => {
        if (!result.error) {
          onClose()
        }
      })
    }
  }

  return (
    <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id='name'
            label='Portfolio Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id='description'
            label='Description'
            name='description'
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id='cashBalance'
            label='Cash Balance'
            name='cashBalance'
            type='number'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            value={formData.cashBalance}
            onChange={handleChange}
            error={!!errors.cashBalance}
          />
          {errors.cashBalance && (
            <FormHelperText error>{errors.cashBalance}</FormHelperText>
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button type='submit' variant='contained'>
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}

export default PortfolioEditForm
