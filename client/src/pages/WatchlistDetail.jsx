import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Typography, Box } from '@mui/material'

const WatchlistDetail = () => {
  const { id } = useParams()

  return (
    <Container maxWidth='lg'>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Watchlist Detail
        </Typography>
        <Typography variant='body1'>Watchlist ID: {id}</Typography>
        <Typography variant='body1'>
          This is a placeholder for the Watchlist Detail page.
        </Typography>
      </Box>
    </Container>
  )
}

export default WatchlistDetail
