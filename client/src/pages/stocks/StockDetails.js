import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import {
  fetchStockDetails,
  fetchStockHistory,
} from '../../store/slices/stockSlice'
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatNumber,
} from '../../utils/formatters'

const StockDetail = () => {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentStock, stockHistory, loading, error } = useSelector(
    (state) => state.stock
  )
  const [timeRange, setTimeRange] = useState('1m')

  useEffect(() => {
    if (symbol) {
      dispatch(fetchStockDetails(symbol))
      dispatch(fetchStockHistory({ symbol, range: timeRange }))
    }
  }, [dispatch, symbol, timeRange])

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading && !currentStock) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6' color='error'>
            Error loading stock data: {error}
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!currentStock) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6'>Stock not found</Typography>
        </Paper>
      </Container>
    )
  }

  const priceChange = currentStock.change || 0
  const priceChangePercent = currentStock.changePercent || 0
  const isPositive = priceChange >= 0

  const historyData = stockHistory[symbol] || []

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4' component='h1' sx={{ mr: 2 }}>
                {currentStock.symbol}
              </Typography>
              <Chip
                label={currentStock.exchange}
                color='primary'
                size='small'
              />
            </Box>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              {currentStock.name}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: 'left', md: 'right' } }}
          >
            <Typography variant='h4' component='div'>
              {formatCurrency(currentStock.price)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {isPositive ? (
                <TrendingUpIcon color='success' sx={{ mr: 1 }} />
              ) : (
                <TrendingDownIcon color='error' sx={{ mr: 1 }} />
              )}
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
                sx={{ mr: 1 }}
              >
                {formatCurrency(priceChange)}
              </Typography>
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
              >
                ({formatPercent(priceChangePercent / 100)})
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary'>
              Last updated: {formatDate(currentStock.lastUpdated, 'full')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h6'>Price History</Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label='time range'
            size='small'
          >
            <ToggleButton value='1m'>1M</ToggleButton>
            <ToggleButton value='3m'>3M</ToggleButton>
            <ToggleButton value='6m'>6M</ToggleButton>
            <ToggleButton value='1y'>1Y</ToggleButton>
            <ToggleButton value='5y'>5Y</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : historyData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <Typography variant='body1' sx={{ textAlign: 'center' }}>
              Chart would be displayed here (using Recharts)
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant='body1'>
              No historical data available for this time range.
            </Typography>
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Company Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {currentStock.description ? (
              <Typography variant='body2' paragraph>
                {currentStock.description}
              </Typography>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                No company description available.
              </Typography>
            )}

            <TableContainer component={Box}>
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Sector
                    </TableCell>
                    <TableCell>{currentStock.sector || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Industry
                    </TableCell>
                    <TableCell>{currentStock.industry || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Country
                    </TableCell>
                    <TableCell>{currentStock.country || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Website
                    </TableCell>
                    <TableCell>
                      {currentStock.website ? (
                        <a
                          href={currentStock.website}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {currentStock.website}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Key Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Box}>
              <Table size='small'>
                <TableBody>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Market Cap
                    </TableCell>
                    <TableCell>
                      {currentStock.marketCap
                        ? formatCurrency(currentStock.marketCap, {
                            compact: true,
                          })
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      P/E Ratio
                    </TableCell>
                    <TableCell>
                      {currentStock.pe ? currentStock.pe.toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      EPS
                    </TableCell>
                    <TableCell>
                      {currentStock.eps
                        ? formatCurrency(currentStock.eps)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Dividend Yield
                    </TableCell>
                    <TableCell>
                      {currentStock.dividendYield
                        ? formatPercent(currentStock.dividendYield / 100)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      52-Week High
                    </TableCell>
                    <TableCell>
                      {currentStock.high52Week
                        ? formatCurrency(currentStock.high52Week)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      52-Week Low
                    </TableCell>
                    <TableCell>
                      {currentStock.low52Week
                        ? formatCurrency(currentStock.low52Week)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Average Volume
                    </TableCell>
                    <TableCell>
                      {currentStock.avgVolume
                        ? formatNumber(currentStock.avgVolume)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default StockDetail
