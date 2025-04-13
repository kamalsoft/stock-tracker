import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { formatCurrency, formatPercent } from '../utils/formatters'
import logger from '../utils/logger'

// Mock data for dashboard
const mockPortfolioSummary = {
  totalValue: 345678.9,
  totalReturn: 45678.9,
  totalReturnPercent: 0.1523,
  dailyChange: 2345.67,
  dailyChangePercent: 0.0068,
  portfolioCount: 3,
}

const mockTopPerformers = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 423.56,
    change: 12.45,
    changePercent: 0.0302,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 301.78,
    change: 5.67,
    changePercent: 0.0192,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change: 2.35,
    changePercent: 0.0134,
  },
]

const mockWorstPerformers = [
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 245.34,
    change: -8.76,
    changePercent: -0.0345,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 128.91,
    change: -2.34,
    changePercent: -0.0178,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 325.76,
    change: -1.24,
    changePercent: -0.0038,
  },
]

const mockRecentWatchlist = {
  id: 1,
  name: 'Tech Stocks',
  stocks: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.45,
      change: 2.35,
      changePercent: 0.0134,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 325.76,
      change: -1.24,
      changePercent: -0.0038,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 134.67,
      change: 0.87,
      changePercent: 0.0065,
    },
  ],
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [portfolioSummary, setPortfolioSummary] = useState(null)
  const [topPerformers, setTopPerformers] = useState([])
  const [worstPerformers, setWorstPerformers] = useState([])
  const [recentWatchlist, setRecentWatchlist] = useState(null)

  // Load dashboard data
  useEffect(() => {
    logger.time('Load dashboard')
    // Simulate API call
    setTimeout(() => {
      setPortfolioSummary(mockPortfolioSummary)
      setTopPerformers(mockTopPerformers)
      setWorstPerformers(mockWorstPerformers)
      setRecentWatchlist(mockRecentWatchlist)
      setLoading(false)
      logger.timeEnd('Load dashboard')
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
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Dashboard
      </Typography>

      {/* Portfolio Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant='h6' gutterBottom>
          Portfolio Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Total Value
              </Typography>
              <Typography variant='h5'>
                {formatCurrency(portfolioSummary.totalValue, 'USD')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Total Return
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='h5' sx={{ mr: 1 }}>
                  {formatCurrency(portfolioSummary.totalReturn, 'USD')}
                </Typography>
                <Typography
                  variant='body1'
                  color={
                    portfolioSummary.totalReturnPercent >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  ({formatPercent(portfolioSummary.totalReturnPercent)})
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Today's Change
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {portfolioSummary.dailyChangePercent >= 0 ? (
                  <TrendingUpIcon color='success' sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon color='error' sx={{ mr: 0.5 }} />
                )}
                <Typography
                  variant='h5'
                  color={
                    portfolioSummary.dailyChangePercent >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                  sx={{ mr: 1 }}
                >
                  {formatCurrency(portfolioSummary.dailyChange, 'USD')}
                </Typography>
                <Typography
                  variant='body1'
                  color={
                    portfolioSummary.dailyChangePercent >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  ({formatPercent(portfolioSummary.dailyChangePercent)})
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant='body2' color='text.secondary'>
                Portfolios
              </Typography>
              <Typography variant='h5'>
                {portfolioSummary.portfolioCount}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='outlined' onClick={() => navigate('/portfolios')}>
            View All Portfolios
          </Button>
        </Box>
      </Paper>

      {/* Top and Worst Performers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant='h6' gutterBottom>
              Top Performers
            </Typography>
            {topPerformers.map((stock, index) => (
              <React.Fragment key={stock.symbol}>
                <Box
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/stocks/${stock.symbol}`)}
                >
                  <Box>
                    <Typography variant='body1' fontWeight='bold'>
                      {stock.symbol}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {stock.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant='body1'>
                      {formatCurrency(stock.price, 'USD')}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <TrendingUpIcon
                        color='success'
                        fontSize='small'
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant='body2' color='success.main'>
                        {formatPercent(stock.changePercent)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {index < topPerformers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant='h6' gutterBottom>
              Worst Performers
            </Typography>
            {worstPerformers.map((stock, index) => (
              <React.Fragment key={stock.symbol}>
                <Box
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/stocks/${stock.symbol}`)}
                >
                  <Box>
                    <Typography variant='body1' fontWeight='bold'>
                      {stock.symbol}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {stock.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant='body1'>
                      {formatCurrency(stock.price, 'USD')}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <TrendingDownIcon
                        color='error'
                        fontSize='small'
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant='body2' color='error.main'>
                        {formatPercent(stock.changePercent)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {index < worstPerformers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Watchlist */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h6'>{recentWatchlist.name}</Typography>
          <Button
            variant='text'
            endIcon={<VisibilityIcon />}
            onClick={() => navigate(`/watchlists/${recentWatchlist.id}`)}
          >
            View Watchlist
          </Button>
        </Box>
        <Grid container spacing={2}>
          {recentWatchlist.stocks.map((stock) => (
            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
              <Card variant='outlined'>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='h6'>{stock.symbol}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {stock.changePercent >= 0 ? (
                        <TrendingUpIcon
                          color='success'
                          fontSize='small'
                          sx={{ mr: 0.5 }}
                        />
                      ) : (
                        <TrendingDownIcon
                          color='error'
                          fontSize='small'
                          sx={{ mr: 0.5 }}
                        />
                      )}
                      <Typography
                        variant='body2'
                        color={
                          stock.changePercent >= 0
                            ? 'success.main'
                            : 'error.main'
                        }
                      >
                        {formatPercent(stock.changePercent)}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant='body2' color='text.secondary' noWrap>
                    {stock.name}
                  </Typography>
                  <Typography variant='h6' sx={{ mt: 1 }}>
                    {formatCurrency(stock.price, 'USD')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size='small'
                    onClick={() => navigate(`/stocks/${stock.symbol}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}

export default Dashboard
