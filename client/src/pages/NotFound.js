import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'

const NotFound = () => {
  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <Typography variant='h1' component='h1' gutterBottom>
          404
        </Typography>
        <Typography variant='h4' component='h2' gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant='body1' paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item>
              <Button
                variant='contained'
                component={RouterLink}
                to='/'
                startIcon={<HomeIcon />}
              >
                Back to Home
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='outlined'
                component={RouterLink}
                to='/stocks'
                startIcon={<SearchIcon />}
              >
                Search Stocks
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default NotFound
