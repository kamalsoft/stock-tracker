import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button, Paper } from '@mui/material'
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth='md'>
      <Paper sx={{ p: 4, textAlign: 'center', mt: 8 }}>
        <Typography variant='h1' component='h1' gutterBottom>
          404
        </Typography>
        <Typography variant='h4' component='h2' gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant='body1' paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant='contained'
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
          <Button
            variant='outlined'
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default NotFound
