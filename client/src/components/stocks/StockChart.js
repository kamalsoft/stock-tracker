import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { useTheme } from '@mui/material/styles'
import { formatCurrency } from '../../utils/formatters'

const StockChart = ({ data, isPositive }) => {
  const theme = useTheme()

  // Format the data for the chart
  const chartData = data.map((item) => ({
    date: new Date(item.date),
    value: item.close,
  }))

  // Get the starting price for the reference line
  const startPrice = chartData.length > 0 ? chartData[0].value : 0

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: theme.palette.background.paper,
            padding: '10px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <p style={{ margin: 0 }}>
            {label instanceof Date ? label.toLocaleDateString() : label}
          </p>
          <p
            style={{
              margin: 0,
              color:
                payload[0].value >= startPrice
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              fontWeight: 'bold',
            }}
          >
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  // Format date for X-axis
  const formatXAxis = (tickItem) => {
    if (tickItem instanceof Date) {
      return tickItem.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    }
    return ''
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke={theme.palette.divider} />
        <XAxis
          dataKey='date'
          tickFormatter={formatXAxis}
          stroke={theme.palette.text.secondary}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          domain={['auto', 'auto']}
          tickFormatter={(value) => formatCurrency(value, undefined, 0)}
          stroke={theme.palette.text.secondary}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={startPrice}
          stroke={theme.palette.divider}
          strokeDasharray='3 3'
        />
        <Line
          type='monotone'
          dataKey='value'
          stroke={
            isPositive ? theme.palette.success.main : theme.palette.error.main
          }
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default StockChart
