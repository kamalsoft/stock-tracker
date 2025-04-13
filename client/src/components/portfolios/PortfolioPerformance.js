import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

import { getPortfolioPerformance } from '../../store/slices/portfolioSlice'

const PortfolioPerformance = ({ portfolioId }) => {
  const dispatch = useDispatch()
  const { performance, loading } = useSelector((state) => state.portfolio)

  const [timeRange, setTimeRange] = useState('1M')

  useEffect(() => {
    if (portfolioId) {
      dispatch(getPortfolioPerformance({ portfolioId, range: timeRange }))
    }
  }, [dispatch, portfolioId, timeRange])

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        >
          <Typography variant='body2' fontWeight='bold'>
            {new Date(label).toLocaleDateString()}
          </Typography>
          <Typography variant='body2' color='primary.main'>
            Value: ${payload[0].value.toFixed(2)}
          </Typography>
          {payload[1] && (
            <Typography variant='body2' color='success.main'>
              Invested: ${payload[1].value.toFixed(2)}
            </Typography>
          )}
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!performance || performance.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No performance data available for this portfolio
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Chip
          label='1W'
          onClick={() => handleTimeRangeChange('1W')}
          color={timeRange === '1W' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip
          label='1M'
          onClick={() => handleTimeRangeChange('1M')}
          color={timeRange === '1M' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip
          label='3M'
          onClick={() => handleTimeRangeChange('3M')}
          color={timeRange === '3M' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip
          label='6M'
          onClick={() => handleTimeRangeChange('6M')}
          color={timeRange === '6M' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip
          label='1Y'
          onClick={() => handleTimeRangeChange('1Y')}
          color={timeRange === '1Y' ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        />
        <Chip
          label='All'
          onClick={() => handleTimeRangeChange('ALL')}
          color={timeRange === 'ALL' ? 'primary' : 'default'}
        />
      </Box>

      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={performance}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tickFormatter={(date) => {
                const d = new Date(date)
                return d.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#8884d8'
              name='Portfolio Value'
              activeDot={{ r: 8 }}
            />
            <Line
              type='monotone'
              dataKey='invested'
              stroke='#82ca9d'
              name='Invested Amount'
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Performance Summary */}
      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' gutterBottom>
          Performance Summary
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {performance.length > 0 && (
            <>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minWidth: 150,
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  Starting Value
                </Typography>
                <Typography variant='h6'>
                  ${performance[0].value.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minWidth: 150,
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  Current Value
                </Typography>
                <Typography variant='h6'>
                  ${performance[performance.length - 1].value.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minWidth: 150,
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  Total Return
                </Typography>
                <Typography
                  variant='h6'
                  color={
                    performance[performance.length - 1].value -
                      performance[0].value >=
                    0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  $
                  {(
                    performance[performance.length - 1].value -
                    performance[0].value
                  ).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minWidth: 150,
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  Return %
                </Typography>
                <Typography
                  variant='h6'
                  color={
                    performance[performance.length - 1].value -
                      performance[0].value >=
                    0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  {(
                    (performance[performance.length - 1].value /
                      performance[0].value -
                      1) *
                    100
                  ).toFixed(2)}
                  %
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PortfolioPerformance
