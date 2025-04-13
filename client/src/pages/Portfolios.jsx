import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import { formatCurrency, formatPercent } from '../utils/formatters'
import logger from '../utils/logger'

// Mock portfolios data
const mockPortfolios = [
  {
    id: 1,
    name: 'Growth Portfolio',
    value: 125678.45,
    change: 2345.67,
    changePercent: 0.019,
    stockCount: 12,
  },
  {
    id: 2,
    name: 'Dividend Portfolio',
    value: 98765.32,
    change: -876.54,
    changePercent: -0.0088,
    stockCount: 8,
  },
  {
    id: 3,
    name: 'Tech Stocks',
    value: 67890.12,
    change: 1234.56,
    changePercent: 0.0185,
    stockCount: 6,
  },
]

const Portfolios = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [portfolios, setPortfolios] = useState([])

  // Load portfolios data
  useEffect(() => {
    logger.time('Load portfolios')
    // Simulate API call
    setTimeout(() => {
      setPortfolios(mockPortfolios)
      setLoading(false)
      logger.timeEnd('Load portfolios')
    }, 1000)
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant='h4' component='h1'>
          Portfolios
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate('/portfolios/create')}
        >
          Create Portfolio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} md={6} lg={4} key={portfolio.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant='h5' component='h2' gutterBottom>
                  {portfolio.name}
                </Typography>
                <Typography variant='h6' gutterBottom>
                  {formatCurrency(portfolio.value, 'USD')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {portfolio.changePercent >= 0 ? (
                    <TrendingUpIcon color='success' sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon color='error' sx={{ mr: 0.5 }} />
                  )}
                  <Typography
                    variant='body1'
                    color={
                      portfolio.changePercent >= 0
                        ? 'success.main'
                        : 'error.main'
                    }
                    sx={{ mr: 1 }}
                  >
                    {formatCurrency(portfolio.change, 'USD')}
                  </Typography>
                  <Typography
                    variant='body1'
                    color={
                      portfolio.changePercent >= 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    ({formatPercent(portfolio.changePercent)})
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {portfolio.stockCount} stocks
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Portfolios
