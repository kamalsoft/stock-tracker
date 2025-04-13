import React from 'react'
import { Box, Typography, Paper, Grid } from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { formatPercent } from '../../utils/formatters'

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#8DD1E1',
  '#A4DE6C',
  '#D0ED57',
  '#F5A623',
]

const PortfolioAllocation = ({ holdings, portfolioId }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No holdings in this portfolio yet. Add a transaction to get started.
        </Typography>
      </Box>
    )
  }

  // Prepare data for pie chart
  const pieData = holdings.map((holding) => ({
    name: holding.symbol,
    value: holding.allocation,
  }))

  // Group small allocations into "Other" category
  const threshold = 3 // 3%
  const mainHoldings = pieData.filter((item) => item.value >= threshold)
  const otherHoldings = pieData.filter((item) => item.value < threshold)

  let chartData = mainHoldings
  if (otherHoldings.length > 0) {
    const otherValue = otherHoldings.reduce((sum, item) => sum + item.value, 0)
    chartData.push({
      name: 'Other',
      value: otherValue,
    })
  }

  // Prepare data for sector allocation
  const sectorData = []
  const sectorMap = {}

  holdings.forEach((holding) => {
    if (holding.sector) {
      if (sectorMap[holding.sector]) {
        sectorMap[holding.sector] += holding.allocation
      } else {
        sectorMap[holding.sector] = holding.allocation
      }
    }
  })

  Object.keys(sectorMap).forEach((sector) => {
    sectorData.push({
      name: sector,
      value: sectorMap[sector],
    })
  })

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant='h6' align='center' gutterBottom>
            Asset Allocation
          </Typography>
          <ResponsiveContainer width='100%' height='90%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'
                nameKey='name'
                label={({ name, percent }) =>
                  `${name} ${formatPercent(percent)}`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatPercent(value / 100)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant='h6' align='center' gutterBottom>
            Sector Allocation
          </Typography>
          {sectorData.length > 0 ? (
            <ResponsiveContainer width='100%' height='90%'>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={120}
                  fill='#8884d8'
                  dataKey='value'
                  nameKey='name'
                  label={({ name, percent }) =>
                    `${name} ${formatPercent(percent)}`
                  }
                >
                  {sectorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPercent(value / 100)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
              }}
            >
              <Typography variant='body1'>Sector data not available</Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  )
}

export default PortfolioAllocation
