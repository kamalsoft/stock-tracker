import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Link,
  Chip,
} from '@mui/material'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const PortfolioHoldings = ({ holdings, portfolioId }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No holdings in this portfolio yet. Add a transaction to get started.
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label='portfolio holdings'>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align='right'>Shares</TableCell>
            <TableCell align='right'>Avg. Cost</TableCell>
            <TableCell align='right'>Current Price</TableCell>
            <TableCell align='right'>Market Value</TableCell>
            <TableCell align='right'>Gain/Loss</TableCell>
            <TableCell align='right'>Gain/Loss %</TableCell>
            <TableCell align='right'>Allocation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow
              key={holding.symbol}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                <Link component={RouterLink} to={`/stocks/${holding.symbol}`}>
                  {holding.symbol}
                </Link>
              </TableCell>
              <TableCell>{holding.name}</TableCell>
              <TableCell align='right'>{holding.shares.toFixed(2)}</TableCell>
              <TableCell align='right'>
                {formatCurrency(holding.averageCost)}
              </TableCell>
              <TableCell align='right'>
                {formatCurrency(holding.currentPrice)}
              </TableCell>
              <TableCell align='right'>
                {formatCurrency(holding.marketValue)}
              </TableCell>
              <TableCell align='right'>
                <Typography
                  color={holding.gainLoss >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(holding.gainLoss)}
                </Typography>
              </TableCell>
              <TableCell align='right'>
                <Chip
                  label={formatPercent(holding.gainLossPercent / 100)}
                  color={holding.gainLossPercent >= 0 ? 'success' : 'error'}
                  size='small'
                />
              </TableCell>
              <TableCell align='right'>
                {formatPercent(holding.allocation / 100)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default PortfolioHoldings
