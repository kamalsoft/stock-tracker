import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'

const StockNews = ({ news, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!news || news.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No news available for this stock
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Latest News
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid item xs={12} md={6} key={item.id || item.url}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              {item.image && (
                <CardMedia
                  component='img'
                  sx={{ width: 120 }}
                  image={item.image}
                  alt={item.title}
                />
              )}
              <Box
                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
              >
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Link
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    underline='hover'
                    color='inherit'
                  >
                    <Typography
                      component='div'
                      variant='subtitle1'
                      fontWeight='bold'
                    >
                      {item.title}
                    </Typography>
                  </Link>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mt: 1 }}
                  >
                    {item.summary
                      ? item.summary.length > 150
                        ? `${item.summary.substring(0, 150)}...`
                        : item.summary
                      : ''}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Typography variant='caption' color='text.secondary'>
                      {item.source || 'Unknown Source'}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString()
                        : ''}
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default StockNews
