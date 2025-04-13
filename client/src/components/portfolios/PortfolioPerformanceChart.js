import React, { useState } from 'react'
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Typography,
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency, formatDate } from '../../utils/formatters'

const PortfolioPerformanceChart = ({ performance, portfolioId }) => {
  const [timeRange, setTimeRange] = useState('1M')

  if (!performance || performance.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No performance data available for this portfolio yet.
        </Typography>
      </Box>
    )
  }

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange)
    }
  }

  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date()
    let startDate

    switch (timeRange) {
      case '1W':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case '1M':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case '3M':
        startDate = new Date(now.setMonth(now.getMonth() - 3))
        break
      case '6M':
        startDate = new Date(now.setMonth(now.getMonth() - 6))
        break
      case '1Y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      case 'ALL':
      default:
        return performance
    }

    return performance.filter((item) => new Date(item.date) >= startDate)
  }

  const filteredData = getFilteredData()

  // Calculate min and max values for better chart display
  const values = filteredData.map((item) => item.value)
  const minValue = Math.min(...values) * 0.95
  const maxValue = Math.max(...values) * 1.05

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label='time range'
          size='small'
        >
          <ToggleButton value='1W'>1W</ToggleButton>
          <ToggleButton value='1M'>1M</ToggleButton>
          <ToggleButton value='3M'>3M</ToggleButton>
          <ToggleButton value='6M'>6M</ToggleButton>
          <ToggleButton value='1Y'>1Y</ToggleButton>
          <ToggleButton value='ALL'>ALL</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper sx={{ p: 2, height: 400 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={filteredData}
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
              tickFormatter={(date) => formatDate(date, 'short')}
            />
            <YAxis
              domain={[minValue, maxValue]}
              tickFormatter={(value) =>
                formatCurrency(value, { compact: true })
              }
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Portfolio Value']}
              labelFormatter={(date) => formatDate(date)}
            />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#8884d8'
              activeDot={{ r: 8 }}
              name='Portfolio Value'
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  )
}

export default PortfolioPerformanceChart
