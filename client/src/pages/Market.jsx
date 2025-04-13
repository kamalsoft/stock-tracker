import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from '@mui/material'
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material'
import { formatCurrency, formatPercent } from '../utils/formatters'
import logger from '../utils/logger'

// Mock data for market overview
const mockMarketData = {
  indices: [
    { name: 'S&P 500', value: 4532.12, change: 1.23, changePercent: 0.027 },
    {
      name: 'Dow Jones',
      value: 35678.45,
      change: -234.12,
      changePercent: -0.0065,
    },
    { name: 'NASDAQ', value: 14897.23, change: 78.45, changePercent: 0.0053 },
    {
      name: 'Russell 2000',
      value: 2245.67,
      change: -12.34,
      changePercent: -0.0055,
    },
  ],
  stocks: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.45,
      change: 2.34,
      changePercent: 0.0133,
      volume: 78456123,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 342.12,
      change: 5.67,
      changePercent: 0.0168,
      volume: 45678912,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2897.34,
      change: -12.45,
      changePercent: -0.0043,
      volume: 23456789,
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 3456.78,
      change: -23.45,
      changePercent: -0.0067,
      volume: 34567890,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 987.65,
      change: 34.56,
      changePercent: 0.0363,
      volume: 56789012,
    },
    {
      symbol: 'FB',
      name: 'Meta Platforms Inc.',
      price: 345.67,
      change: 7.89,
      changePercent: 0.0234,
      volume: 67890123,
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
      price: 567.89,
      change: -8.9,
      changePercent: -0.0154,
      volume: 12345678,
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 234.56,
      change: 4.56,
      changePercent: 0.0198,
      volume: 89012345,
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 167.89,
      change: 1.23,
      changePercent: 0.0074,
      volume: 23456789,
    },
    {
      symbol: 'BAC',
      name: 'Bank of America Corp.',
      price: 45.67,
      change: -0.78,
      changePercent: -0.0168,
      volume: 34567890,
    },
  ],
  sectors: [
    { name: 'Technology', change: 1.23, changePercent: 0.0123 },
    { name: 'Healthcare', change: -0.45, changePercent: -0.0045 },
    { name: 'Financials', change: 0.67, changePercent: 0.0067 },
    { name: 'Consumer Discretionary', change: -0.89, changePercent: -0.0089 },
    { name: 'Communication Services', change: 1.01, changePercent: 0.0101 },
    { name: 'Industrials', change: 0.23, changePercent: 0.0023 },
    { name: 'Energy', change: -1.45, changePercent: -0.0145 },
  ],
}

const Market = () => {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [marketData, setMarketData] = useState(mockMarketData)
  const [watchlist, setWatchlist] = useState(['AAPL', 'MSFT']) // Mock watchlist

  // Simulate loading market data
  useEffect(() => {
    logger.time('Load market data')
    const timer = setTimeout(() => {
      setLoading(false)
      logger.timeEnd('Load market data')
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRefresh = () => {
    logger.log('Refreshing market data')
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleToggleWatchlist = (symbol) => {
    logger.log(`Toggle watchlist for ${symbol}`)
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((item) => item !== symbol))
    } else {
      setWatchlist([...watchlist, symbol])
    }
  }

  // Filter stocks based on search query
  const filteredStocks = marketData.stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Render market indices cards
  const renderIndices = () => {
    return (
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {marketData.indices.map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index.name}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant='subtitle1' component='div' noWrap>
                {index.name}
              </Typography>
              <Typography variant='h5' component='div' sx={{ mt: 1 }}>
                {index.value.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {index.changePercent >= 0 ? (
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
                    index.changePercent >= 0 ? 'success.main' : 'error.main'
                  }
                >
                  {index.change > 0 ? '+' : ''}
                  {index.change.toFixed(2)} (
                  {formatPercent(index.changePercent)})
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    )
  }

  // Render stocks table
  const renderStocksTable = () => {
    return (
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Price</TableCell>
                <TableCell align='right'>Change</TableCell>
                <TableCell align='right'>% Change</TableCell>
                <TableCell align='right'>Volume</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((stock) => (
                  <TableRow key={stock.symbol} hover>
                    <TableCell component='th' scope='row'>
                      <Typography variant='body2' fontWeight='bold'>
                        {stock.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell align='right'>
                      {formatCurrency(stock.price, 'USD')}
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        color:
                          stock.change >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {stock.change > 0 ? '+' : ''}
                      {stock.change.toFixed(2)}
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        color:
                          stock.changePercent >= 0
                            ? 'success.main'
                            : 'error.main',
                      }}
                    >
                      {formatPercent(stock.changePercent)}
                    </TableCell>
                    <TableCell align='right'>
                      {stock.volume.toLocaleString()}
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        size='small'
                        onClick={() => handleToggleWatchlist(stock.symbol)}
                        color={
                          watchlist.includes(stock.symbol)
                            ? 'primary'
                            : 'default'
                        }
                      >
                        {watchlist.includes(stock.symbol) ? (
                          <StarIcon />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredStocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    )
  }

  // Render sectors table
  const renderSectors = () => {
    return (
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table size='medium'>
            <TableHead>
              <TableRow>
                <TableCell>Sector</TableCell>
                <TableCell align='right'>Change</TableCell>
                <TableCell align='right'>% Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marketData.sectors.map((sector) => (
                <TableRow key={sector.name} hover>
                  <TableCell component='th' scope='row'>
                    {sector.name}
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{
                      color: sector.change >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {sector.change > 0 ? '+' : ''}
                    {sector.change.toFixed(2)}
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{
                      color:
                        sector.changePercent >= 0
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {formatPercent(sector.changePercent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Market Overview
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderIndices()}

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder='Search by symbol or company name'
              variant='outlined'
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor='primary'
              textColor='primary'
              variant='fullWidth'
            >
              <Tab label='Stocks' />
              <Tab label='Sectors' />
            </Tabs>
          </Paper>

          {activeTab === 0 ? renderStocksTable() : renderSectors()}
        </>
      )}
    </Container>
  )
}

export default Market
