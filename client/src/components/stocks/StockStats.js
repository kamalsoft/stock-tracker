import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

const StockStats = ({ stock }) => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Key Statistics
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant='subtitle1' gutterBottom>
            Valuation
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Market Cap
              </Typography>
              <Typography variant='body1'>
                {stock.marketCap
                  ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Enterprise Value
              </Typography>
              <Typography variant='body1'>
                {stock.enterpriseValue
                  ? `$${(stock.enterpriseValue / 1000000000).toFixed(2)}B`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                P/E Ratio
              </Typography>
              <Typography variant='body1'>
                {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Forward P/E
              </Typography>
              <Typography variant='body1'>
                {stock.forwardPE ? stock.forwardPE.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                PEG Ratio
              </Typography>
              <Typography variant='body1'>
                {stock.pegRatio ? stock.pegRatio.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Price/Sales
              </Typography>
              <Typography variant='body1'>
                {stock.priceToSales ? stock.priceToSales.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Price/Book
              </Typography>
              <Typography variant='body1'>
                {stock.priceToBook ? stock.priceToBook.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                EV/Revenue
              </Typography>
              <Typography variant='body1'>
                {stock.evToRevenue ? stock.evToRevenue.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='subtitle1' gutterBottom>
            Financial Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Profit Margin
              </Typography>
              <Typography variant='body1'>
                {stock.profitMargin
                  ? `${(stock.profitMargin * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Operating Margin
              </Typography>
              <Typography variant='body1'>
                {stock.operatingMargin
                  ? `${(stock.operatingMargin * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                ROE
              </Typography>
              <Typography variant='body1'>
                {stock.returnOnEquity
                  ? `${(stock.returnOnEquity * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                ROA
              </Typography>
              <Typography variant='body1'>
                {stock.returnOnAssets
                  ? `${(stock.returnOnAssets * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Revenue Growth (YoY)
              </Typography>
              <Typography variant='body1'>
                {stock.revenueGrowth
                  ? `${(stock.revenueGrowth * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                EPS Growth (YoY)
              </Typography>
              <Typography variant='body1'>
                {stock.epsGrowth
                  ? `${(stock.epsGrowth * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Debt to Equity
              </Typography>
              <Typography variant='body1'>
                {stock.debtToEquity ? stock.debtToEquity.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Current Ratio
              </Typography>
              <Typography variant='body1'>
                {stock.currentRatio ? stock.currentRatio.toFixed(2) : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='subtitle1' gutterBottom>
            Trading Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                52-Week High
              </Typography>
              <Typography variant='body1'>
                {stock.high52Week ? `$${stock.high52Week.toFixed(2)}` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                52-Week Low
              </Typography>
              <Typography variant='body1'>
                {stock.low52Week ? `$${stock.low52Week.toFixed(2)}` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                50-Day Avg
              </Typography>
              <Typography variant='body1'>
                {stock.priceAvg50 ? `$${stock.priceAvg50.toFixed(2)}` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                200-Day Avg
              </Typography>
              <Typography variant='body1'>
                {stock.priceAvg200 ? `$${stock.priceAvg200.toFixed(2)}` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Volume
              </Typography>
              <Typography variant='body1'>
                {stock.volume ? stock.volume.toLocaleString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Avg Volume
              </Typography>
              <Typography variant='body1'>
                {stock.avgVolume ? stock.avgVolume.toLocaleString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant='subtitle1' gutterBottom>
            Dividends & Splits
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Dividend Rate
              </Typography>
              <Typography variant='body1'>
                {stock.dividendRate
                  ? `$${stock.dividendRate.toFixed(2)}`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Dividend Yield
              </Typography>
              <Typography variant='body1'>
                {stock.dividendYield
                  ? `${(stock.dividendYield * 100).toFixed(2)}%`
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Ex-Dividend Date
              </Typography>
              <Typography variant='body1'>
                {stock.exDividendDate
                  ? new Date(stock.exDividendDate).toLocaleDateString()
                  : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Last Split Factor
              </Typography>
              <Typography variant='body1'>
                {stock.lastSplitFactor || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Last Split Date
              </Typography>
              <Typography variant='body1'>
                {stock.lastSplitDate
                  ? new Date(stock.lastSplitDate).toLocaleDateString()
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StockStats
