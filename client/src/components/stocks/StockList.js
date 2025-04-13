import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const StockList = ({ stocks, title }) => {
  const navigate = useNavigate()

  if (!stocks || stocks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>No stocks to display.</Typography>
      </Box>
    )
  }

  const handleRowClick = (symbol) => {
    navigate(`/stocks/${symbol}`)
  }

  return (
    <Box>
      {title && (
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
      )}

      <TableContainer component={Paper} elevation={0}>
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
            {stocks.map((stock) => {
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
    </Box>
  )
}

export default StockList
