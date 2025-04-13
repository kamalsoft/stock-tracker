import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import { searchStocks } from '../../store/slices/stockSlice'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const StockSearch = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { searchResults, loading, error } = useSelector((state) => state.stock)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  // Search stocks when debounced query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      dispatch(searchStocks(debouncedQuery))
    }
  }, [debouncedQuery, dispatch])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleRowClick = (symbol) => {
    navigate(`/stocks/${symbol}`)
  }

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Stock Search
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Search for stocks by symbol or company name...'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position='end'>
                  <IconButton onClick={handleClearSearch} edge='end'>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color='error'>Error: {error}</Typography>
          </Box>
        ) : searchResults && searchResults.length > 0 ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell align='right'>Price</TableCell>
                  <TableCell align='right'>Change</TableCell>
                  <TableCell align='right'>% Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((stock) => {
                  const isPositive = (stock.change || 0) >= 0

                  return (
                    <TableRow
                      key={stock.symbol}
                      hover
                      onClick={() => handleRowClick(stock.symbol)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell component='th' scope='row'>
                        <Typography variant='body2' fontWeight='bold'>
                          {stock.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>
                        <Chip label={stock.exchange} size='small' />
                      </TableCell>
                      <TableCell align='right'>
                        {formatCurrency(stock.price)}
                      </TableCell>
                      <TableCell align='right'>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {isPositive ? (
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
                            color={isPositive ? 'success.main' : 'error.main'}
                          >
                            {formatCurrency(stock.change)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography
                          variant='body2'
                          color={isPositive ? 'success.main' : 'error.main'}
                        >
                          {formatPercent(stock.changePercent / 100)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : debouncedQuery.length >= 2 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant='body1'>
              No stocks found matching "{debouncedQuery}".
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant='body1'>
              Enter a stock symbol or company name to search.
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Examples: AAPL, MSFT, GOOGL, Amazon, Tesla
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Popular Stocks
        </Typography>
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43 },
                {
                  symbol: 'MSFT',
                  name: 'Microsoft Corporation',
                  price: 325.76,
                },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21 },
                { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 145.68 },
                { symbol: 'TSLA', name: 'Tesla, Inc.', price: 237.49 },
              ].map((stock) => (
                <TableRow
                  key={stock.symbol}
                  hover
                  onClick={() => handleRowClick(stock.symbol)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component='th' scope='row'>
                    <Typography variant='body2' fontWeight='bold'>
                      {stock.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell align='right'>
                    {formatCurrency(stock.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default StockSearch
