import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import { fetchPortfolios } from '../store/slices/portfolioSlice'
import { fetchRecentTransactions } from '../store/slices/transactionSlice'
import { fetchWatchlist } from '../store/slices/watchlistSlice'
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters'
import PortfolioCard from '../components/portfolios/PortfolioCard'
import CreatePortfolioDialog from '../components/portfolios/CreatePortfolioDialog'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { portfolios, loading: portfoliosLoading } = useSelector(
    (state) => state.portfolio
  )

  const { recentTransactions, loading: transactionsLoading } = useSelector(
    (state) => state.transaction
  )

  const { watchlist, loading: watchlistLoading } = useSelector(
    (state) => state.watchlist
  )

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)

  useEffect(() => {
    dispatch(fetchPortfolios())
    dispatch(fetchRecentTransactions(5))
    dispatch(fetchWatchlist())
  }, [dispatch])

  const handleCreatePortfolio = () => {
    setCreateDialogOpen(true)
  }

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false)
  }

  const handleViewAllPortfolios = () => {
    // Navigate to portfolios page if you have one, or just stay on dashboard
    // navigate('/portfolios');
  }

  const handleViewAllTransactions = () => {
    // Navigate to transactions page if you have one
    // navigate('/transactions');
  }

  const handleViewAllWatchlist = () => {
    // Navigate to watchlist page if you have one
    // navigate('/watchlist');
  }

  const handleViewPortfolio = (id) => {
    navigate(`/portfolios/${id}`)
  }

  const handleViewStock = (symbol) => {
    navigate(`/stocks/${symbol}`)
  }

  // Calculate total portfolio value
  const totalPortfolioValue = portfolios.reduce(
    (total, portfolio) => total + (portfolio.totalValue || 0),
    0
  )
  const totalCost = portfolios.reduce(
    (total, portfolio) => total + (portfolio.totalCost || 0),
    0
  )
  const totalGain = totalPortfolioValue - totalCost
  const totalGainPercent = totalCost > 0 ? totalGain / totalCost : 0

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant='h6' gutterBottom>
                  Welcome back, {user?.name || 'Investor'}!
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Here's a summary of your investment portfolio.
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: 'left', md: 'right' } }}
              >
                <Typography variant='h4' component='div'>
                  {formatCurrency(totalPortfolioValue)}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  }}
                >
                  {totalGain >= 0 ? (
                    <TrendingUpIcon color='success' sx={{ mr: 1 }} />
                  ) : (
                    <TrendingDownIcon color='error' sx={{ mr: 1 }} />
                  )}
                  <Typography
                    variant='body1'
                    color={totalGain >= 0 ? 'success.main' : 'error.main'}
                    sx={{ mr: 1 }}
                  >
                    {formatCurrency(totalGain)}
                  </Typography>
                  <Typography
                    variant='body1'
                    color={totalGain >= 0 ? 'success.main' : 'error.main'}
                  >
                    ({formatPercent(totalGainPercent)})
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  Total Investment: {formatCurrency(totalCost)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Portfolios */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Your Portfolios</Typography>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleCreatePortfolio}
                  sx={{ mr: 1 }}
                >
                  Create
                </Button>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewAllPortfolios}
                >
                  View All
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {portfoliosLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : portfolios.length > 0 ? (
              <Grid container spacing={2}>
                {portfolios.map((portfolio) => (
                  <Grid item xs={12} sm={6} key={portfolio.id}>
                    <PortfolioCard
                      portfolio={portfolio}
                      onClick={() => handleViewPortfolio(portfolio.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='body1' paragraph>
                  You don't have any portfolios yet.
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={handleCreatePortfolio}
                >
                  Create Your First Portfolio
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity & Watchlist */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Recent Transactions</Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewAllTransactions}
                size='small'
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {transactionsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              <List disablePadding>
                {recentTransactions.map((transaction) => {
                  const isPositive = ['sell', 'dividend'].includes(
                    transaction.type.toLowerCase()
                  )
                  const total = transaction.price * transaction.quantity

                  return (
                    <ListItem key={transaction.id} divider sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip
                              label={transaction.type}
                              size='small'
                              color={
                                transaction.type.toLowerCase() === 'buy'
                                  ? 'primary'
                                  : transaction.type.toLowerCase() === 'sell'
                                  ? 'secondary'
                                  : 'default'
                              }
                              sx={{ mr: 1 }}
                            />
                            <Typography variant='body2' fontWeight='bold'>
                              {transaction.symbol}
                            </Typography>
                          </Box>
                        }
                        secondary={formatDate(transaction.date)}
                      />
                      <ListItemSecondaryAction>
                        <Typography
                          variant='body2'
                          color={isPositive ? 'success.main' : 'error.main'}
                        >
                          {isPositive ? '+' : '-'}
                          {formatCurrency(Math.abs(total))}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  No recent transactions.
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Watchlist</Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewAllWatchlist}
                size='small'
              >
                View All
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {watchlistLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : watchlist && watchlist.length > 0 ? (
              <List disablePadding>
                {watchlist.map((stock) => {
                  const isPositive = (stock.change || 0) >= 0

                  return (
                    <ListItem
                      key={stock.symbol}
                      button
                      divider
                      onClick={() => handleViewStock(stock.symbol)}
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant='body2' fontWeight='bold'>
                            {stock.symbol}
                          </Typography>
                        }
                        secondary={stock.name}
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant='body2'>
                            {formatCurrency(stock.price)}
                          </Typography>
                          <Typography
                            variant='caption'
                            color={isPositive ? 'success.main' : 'error.main'}
                            display='block'
                          >
                            {isPositive ? '+' : ''}
                            {formatCurrency(stock.change)} (
                            {formatPercent(stock.changePercent / 100)})
                          </Typography>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                  Your watchlist is empty.
                </Typography>
                <Button
                  size='small'
                  onClick={() => navigate('/stocks')}
                  sx={{ mt: 1 }}
                >
                  Add Stocks
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create Portfolio Dialog */}
      <CreatePortfolioDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
      />
    </Container>
  )
}

export default Dashboard
