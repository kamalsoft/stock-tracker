import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Generate colors for pie chart
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#A4DE6C',
  '#D0ED57',
  '#FAD000',
]

const PortfolioSummaryChart = ({ holdings }) => {
  // Prepare data for pie chart
  const data = holdings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.marketValue,
    color: COLORS[index % COLORS.length],
  }))

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
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
            {item.name}
          </Typography>
          <Typography variant='body2'>
            ${item.value.toFixed(2)} (
            {(
              (item.value / data.reduce((sum, item) => sum + item.value, 0)) *
              100
            ).toFixed(2)}
            %)
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default PortfolioSummaryChart
