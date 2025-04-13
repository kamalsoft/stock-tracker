import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  IconButton,
} from '@mui/material'
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material'
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
} from '../utils/formatters'
import logger from '../utils/logger'

// Mock stocks data
const mockStocksData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change: 2.35,
    changePercent: 0.0134,
    volume: 68432100,
    marketCap: 2795432000000,
    isInWatchlist: false,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 325.76,
    change: -1.24,
    changePercent: -0.0038,
    volume: 23456700,
    marketCap: 2423567000000,
    isInWatchlist: true,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 134.67,
    change: 0.87,
    changePercent: 0.0065,
    volume: 18765400,
    marketCap: 1712345000000,
    isInWatchlist: false,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 128.91,
    change: -2.34,
    changePercent: -0.0178,
    volume: 45678900,
    marketCap: 1345678000000,
    isInWatchlist: true,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 301.78,
    change: 5.67,
    changePercent: 0.0192,
    volume: 28765400,
    marketCap: 789456000000,
    isInWatchlist: false,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 245.34,
    change: -8.76,
    changePercent: -0.0345,
    volume: 98765400,
    marketCap: 756432000000,
    isInWatchlist: false,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 423.56,
    change: 12.45,
    changePercent: 0.0302,
    volume: 34567800,
    marketCap: 1045678000000,
    isInWatchlist: true,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 145.23,
    change: 0.56,
    changePercent: 0.0039,
    volume: 12345600,
    marketCap: 423456000000,
    isInWatchlist: false,
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 234.56,
    change: 1.23,
    changePercent: 0.0053,
    volume: 8765400,
    marketCap: 489765000000,
    isInWatchlist: false,
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 156.78,
    change: -0.45,
    changePercent: -0.0029,
    volume: 7654300,
    marketCap: 423456000000,
    isInWatchlist: false,
  },
]

const Stocks = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stocks, setStocks] = useState([])
  const [filteredStocks, setFilteredStocks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [orderBy, setOrderBy] = useState('marketCap')
  const [order, setOrder] = useState('desc')

  // Load stocks data
  useEffect(() => {
    logger.time('Load stocks')
    // Simulate API call
    setTimeout(() => {
      setStocks(mockStocksData)
      setFilteredStocks(mockStocksData)
      setLoading(false)
      logger.timeEnd('Load stocks')
    }, 1000)
  }, [])

  // Filter stocks based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStocks(stocks)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    )

    setFilteredStocks(filtered)
  }, [searchQuery, stocks])

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)

    const sortedStocks = [...filteredStocks].sort((a, b) => {
      const aValue = a[property]
      const bValue = b[property]

      if (order === 'desc' || (orderBy === property && isAsc)) {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

    setFilteredStocks(sortedStocks)
  }

  const handleToggleWatchlist = (symbol) => {
    logger.log(`Toggling watchlist status for ${symbol}`)

    // Update the stocks data
    const updatedStocks = stocks.map((stock) => {
      if (stock.symbol === symbol) {
        return { ...stock, isInWatchlist: !stock.isInWatchlist }
      }
      return stock
    })

    setStocks(updatedStocks)

    // Update filtered stocks as well
    const updatedFilteredStocks = filteredStocks.map((stock) => {
      if (stock.symbol === symbol) {
        return { ...stock, isInWatchlist: !stock.isInWatchlist }
      }
      return stock
    })

    setFilteredStocks(updatedFilteredStocks)
  }

  const handleStockClick = (symbol) => {
    navigate(`/stocks/${symbol}`)
  }

  if (loading) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Stocks
        </Typography>
        <TextField
          fullWidth
          placeholder='Search by symbol or company name'
          variant='outlined'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'symbol'}
                  direction={orderBy === 'symbol' ? order : 'asc'}
                  onClick={() => handleRequestSort('symbol')}
                >
                  Symbol
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleRequestSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'changePercent'}
                  direction={orderBy === 'changePercent' ? order : 'asc'}
                  onClick={() => handleRequestSort('changePercent')}
                >
                  Change
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'volume'}
                  direction={orderBy === 'volume' ? order : 'asc'}
                  onClick={() => handleRequestSort('volume')}
                >
                  Volume
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'marketCap'}
                  direction={orderBy === 'marketCap' ? order : 'asc'}
                  onClick={() => handleRequestSort('marketCap')}
                >
                  Market Cap
                </TableSortLabel>
              </TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <Typography variant='body1' sx={{ py: 2 }}>
                    No stocks found matching your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStocks.map((stock) => (
                <TableRow key={stock.symbol} hover sx={{ cursor: 'pointer' }}>
                  <TableCell
                    component='th'
                    scope='row'
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <Typography variant='body1' fontWeight='bold'>
                      {stock.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => handleStockClick(stock.symbol)}>
                    {stock.name}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    {formatCurrency(stock.price, 'USD')}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
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
                        {formatCurrency(stock.change, 'USD')} (
                        {formatPercent(stock.changePercent)})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    {formatLargeNumber(stock.volume)}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    {formatLargeNumber(stock.marketCap)}
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleWatchlist(stock.symbol)
                      }}
                      color={stock.isInWatchlist ? 'primary' : 'default'}
                      aria-label={
                        stock.isInWatchlist
                          ? 'Remove from watchlist'
                          : 'Add to watchlist'
                      }
                    >
                      {stock.isInWatchlist ? (
                        <BookmarkIcon />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default Stocks
