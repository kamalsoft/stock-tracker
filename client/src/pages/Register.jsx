import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { register, clearAuthError } from '../store/slices/authSlice'
import logger from '../utils/logger'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const [activeStep, setActiveStep] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      logger.log('User is authenticated, redirecting to dashboard')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const validateStep1 = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = 'Name is required'
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors = {}

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1)
      }
    }
  }

  const handleBack = () => {
    setActiveStep(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (activeStep === 0) {
      handleNext()
      return
    }

    if (!validateStep2()) return

    logger.time('Registration attempt')
    try {
      await dispatch(register({ name, email, password })).unwrap()
      logger.log('Registration successful')
    } catch (err) {
      logger.error('Registration failed', err)
    } finally {
      logger.timeEnd('Registration attempt')
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const steps = ['Account Information', 'Set Password']

  return (
    <Container component='main' maxWidth='xs'>
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Create an Account
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity='error' sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 3, width: '100%' }}
        >
          {activeStep === 0 ? (
            <>
              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                label='Full Name'
                name='name'
                autoComplete='name'
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                disabled={loading}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='new-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleTogglePasswordVisibility}
                        edge='end'
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type={showPassword ? 'text' : 'password'}
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(formErrors.confirmPassword)}
                helperText={formErrors.confirmPassword}
                disabled={loading}
              />
            </>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
              mb: 2,
            }}
          >
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={loading}
              sx={{ ml: activeStep > 0 ? 1 : 0 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === 0 ? (
                'Next'
              ) : (
                'Sign Up'
              )}
            </Button>
          </Box>

          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default Register
