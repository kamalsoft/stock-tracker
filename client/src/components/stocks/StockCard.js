import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const StockCard = ({ stock }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/stocks/${stock.symbol}`)
  }

  const isPositive = (stock.change || 0) >= 0

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant='h6'
              component='div'
              sx={{ fontWeight: 'bold' }}
            >
              {stock.symbol}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              noWrap
              sx={{ maxWidth: 200 }}
            >
              {stock.name}
            </Typography>
          </Box>
          <Chip label={stock.exchange} size='small' />
        </Box>

        <Typography variant='h5' component='div' sx={{ mt: 2 }}>
          {formatCurrency(stock.price)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {isPositive ? (
            <TrendingUpIcon color='success' fontSize='small' sx={{ mr: 0.5 }} />
          ) : (
            <TrendingDownIcon color='error' fontSize='small' sx={{ mr: 0.5 }} />
          )}
          <Typography
            variant='body2'
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{ mr: 1 }}
          >
            {formatCurrency(stock.change)}
          </Typography>
          <Typography
            variant='body2'
            color={isPositive ? 'success.main' : 'error.main'}
          >
            ({formatPercent(stock.changePercent / 100)})
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StockCard
