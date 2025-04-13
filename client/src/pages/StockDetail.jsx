import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
  // ShowChart as ShowChartIcon,
  // BarChart as BarChartIcon,
  Description as DescriptionIcon,
  // Timeline as TimelineIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import {
  formatCurrency,
  formatPercent,
  formatDate,
  formatLargeNumber,
} from '../utils/formatters'
import logger from '../utils/logger'

// Mock stock data
const mockStockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 178.45,
  change: 2.35,
  changePercent: 0.0134,
  previousClose: 176.1,
  open: 176.95,
  dayLow: 175.82,
  dayHigh: 179.12,
  volume: 68432100,
  avgVolume: 59283400,
  marketCap: 2795432000000,
  peRatio: 29.45,
  dividend: 0.92,
  dividendYield: 0.0052,
  eps: 6.06,
  beta: 1.28,
  yearLow: 124.17,
  yearHigh: 198.23,
  description:
    'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories. It also provides AppleCare support services; cloud services store services; and operates various platforms, including the App Store, that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts.',
  sector: 'Technology',
  industry: 'Consumer Electronics',
  exchange: 'NASDAQ',
  isInWatchlist: false,
}

// Mock news data
const mockNewsData = [
  {
    id: 1,
    title: 'Apple Announces New iPhone 14 Pro with Revolutionary Camera System',
    source: 'TechCrunch',
    date: '2023-09-12T14:30:00.000Z',
    url: 'https://example.com/news/1',
    summary:
      'Apple unveiled its latest iPhone models with significant camera improvements and a new A16 chip.',
  },
  {
    id: 2,
    title: 'Apple Reports Record Q3 Earnings, Beating Analyst Expectations',
    source: 'CNBC',
    date: '2023-08-03T18:45:00.000Z',
    url: 'https://example.com/news/2',
    summary:
      'Apple reported quarterly revenue of $83.4 billion, up 8% year over year, and quarterly earnings per diluted share of $1.30, up 9% year over year.',
  },
  {
    id: 3,
    title: 'Apple Expands Services Business with New Fitness+ Features',
    source: 'Bloomberg',
    date: '2023-07-20T09:15:00.000Z',
    url: 'https://example.com/news/3',
    summary:
      'Apple announced new features for its Fitness+ subscription service, including new workout types and expanded availability in more countries.',
  },
  {
    id: 4,
    title:
      'Apple&quote;s M2 MacBook Air Review: The Best Laptop for Most People',
    source: 'The Verge',
    date: '2023-07-15T12:00:00.000Z',
    url: 'https://example.com/news/4',
    summary:
      'The new MacBook Air with M2 processor offers excellent performance, battery life, and design, making it the best laptop for most users.',
  },
  {
    id: 5,
    title: 'Apple Faces Antitrust Scrutiny Over App Store Policies',
    source: 'Wall Street Journal',
    date: '2023-06-28T15:20:00.000Z',
    url: 'https://example.com/news/5',
    summary:
      'Regulators are investigating Apple&quot;s App Store policies and the fees it charges developers, which could lead to significant changes in how the company operates its app marketplace.',
  },
]

// Mock historical data (simplified for this example)
const mockHistoricalData = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    close: 150 + Math.random() * 50,
    volume: 40000000 + Math.random() * 30000000,
  })),
  weekly: Array.from({ length: 52 }, (_, i) => ({
    date: new Date(Date.now() - (51 - i) * 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    close: 120 + Math.random() * 80,
    volume: 200000000 + Math.random() * 100000000,
  })),
  monthly: Array.from({ length: 24 }, (_, i) => ({
    date: new Date(Date.now() - (23 - i) * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    close: 100 + Math.random() * 100,
    volume: 800000000 + Math.random() * 400000000,
  })),
}

// Mock watchlists for the add to watchlist dialog
const mockWatchlists = [
  { id: 1, name: 'Tech Stocks' },
  { id: 2, name: 'Growth Stocks' },
  { id: 3, name: 'Dividend Stocks' },
]

const StockDetail = () => {
  const { symbol } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [stockData, setStockData] = useState(null)
  const [newsData, setNewsData] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [historicalData, setHistoricalData] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [timeframe, setTimeframe] = useState('daily')

  // Dialog states
  const [addToWatchlistDialog, setAddToWatchlistDialog] = useState(false)
  const [selectedWatchlist, setSelectedWatchlist] = useState('')

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)

  // Load stock data
  useEffect(() => {
    logger.time('Load stock details')
    // Simulate API call
    setTimeout(() => {
      setStockData({
        ...mockStockData,
        symbol: symbol.toUpperCase(), // Use the symbol from URL
      })
      setNewsData(mockNewsData)
      setHistoricalData(mockHistoricalData)
      setLoading(false)
      logger.timeEnd('Load stock details')
    }, 1000)
  }, [symbol])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value)
  }

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleAddToWatchlist = () => {
    if (!selectedWatchlist) return

    logger.log(
      `Adding ${stockData.symbol} to watchlist ID: ${selectedWatchlist}`
    )

    // In a real app, you would send this to your API
    setStockData({
      ...stockData,
      isInWatchlist: true,
    })

    setAddToWatchlistDialog(false)
    setSelectedWatchlist('')
  }

  const handleRemoveFromWatchlist = () => {
    logger.log(`Removing ${stockData.symbol} from watchlist`)

    // In a real app, you would send this to your API
    setStockData({
      ...stockData,
      isInWatchlist: false,
    })

    handleMenuClose()
  }

  const renderOverview = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              Price Chart
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl size='small' sx={{ minWidth: 120 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  label='Timeframe'
                  onChange={handleTimeframeChange}
                >
                  <MenuItem value='daily'>Daily</MenuItem>
                  <MenuItem value='weekly'>Weekly</MenuItem>
                  <MenuItem value='monthly'>Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                height: 400,
                bgcolor: 'background.default',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color='text.secondary'>
                Chart visualization would go here
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              About {stockData.name}
            </Typography>
            <Typography variant='body1' paragraph>
              {stockData.description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant='body2' color='text.secondary'>
                  Sector
                </Typography>
                <Typography variant='body1'>{stockData.sector}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant='body2' color='text.secondary'>
                  Industry
                </Typography>
                <Typography variant='body1'>{stockData.industry}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant='body2' color='text.secondary'>
                  Exchange
                </Typography>
                <Typography variant='body1'>{stockData.exchange}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant='body2' color='text.secondary'>
                  Market Cap
                </Typography>
                <Typography variant='body1'>
                  {formatLargeNumber(stockData.marketCap, 2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Key Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Previous Close
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.previousClose, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Open
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.open, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Day Low
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.dayLow, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Day High
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.dayHigh, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Volume
                  </Typography>
                  <Typography variant='body1'>
                    {formatLargeNumber(stockData.volume, 2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Avg. Volume
                  </Typography>
                  <Typography variant='body1'>
                    {formatLargeNumber(stockData.avgVolume, 2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    52-Week Low
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.yearLow, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    52-Week High
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.yearHigh, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    P/E Ratio
                  </Typography>
                  <Typography variant='body1'>{stockData.peRatio}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    EPS
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.eps, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    EPS
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.eps, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Dividend
                  </Typography>
                  <Typography variant='body1'>
                    {formatCurrency(stockData.dividend, 'USD')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Dividend Yield
                  </Typography>
                  <Typography variant='body1'>
                    {formatPercent(stockData.dividendYield)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Beta
                  </Typography>
                  <Typography variant='body1'>{stockData.beta}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() =>
                      navigate(
                        `/portfolios/add-transaction/${stockData.symbol}`
                      )
                    }
                  >
                    Add to Portfolio
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {stockData.isInWatchlist ? (
                    <Button
                      variant='outlined'
                      fullWidth
                      startIcon={<BookmarkIcon />}
                      onClick={handleRemoveFromWatchlist}
                    >
                      Remove from Watchlist
                    </Button>
                  ) : (
                    <Button
                      variant='outlined'
                      fullWidth
                      startIcon={<BookmarkBorderIcon />}
                      onClick={() => setAddToWatchlistDialog(true)}
                    >
                      Add to Watchlist
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const renderNews = () => {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Latest News
        </Typography>
        <Box>
          {newsData.map((news) => (
            <Box
              key={news.id}
              sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                {news.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip size='small' label={news.source} sx={{ mr: 1 }} />
                <Typography variant='body2' color='text.secondary'>
                  {formatDate(news.date)}
                </Typography>
              </Box>
              <Typography variant='body1' paragraph>
                {news.summary}
              </Typography>
              <Button
                variant='text'
                size='small'
                href={news.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                Read More
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>
    )
  }

  if (loading) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!stockData) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ mt: 4 }}>
          <Typography variant='h5' gutterBottom>
            Stock not found
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/stocks')}
          >
            Back to Stocks
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/stocks')}
          sx={{ mb: 2 }}
        >
          Back to Stocks
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant='h4' component='h1' sx={{ mr: 2 }}>
                {stockData.symbol}
              </Typography>
              <Typography variant='h6' color='text.secondary'>
                {stockData.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ mr: 2 }}>
                {formatCurrency(stockData.price, 'USD')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {stockData.change >= 0 ? (
                  <TrendingUpIcon color='success' sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon color='error' sx={{ mr: 0.5 }} />
                )}
                <Typography
                  variant='body1'
                  color={stockData.change >= 0 ? 'success.main' : 'error.main'}
                  sx={{ mr: 1 }}
                >
                  {formatCurrency(stockData.change, 'USD')}
                </Typography>
                <Typography
                  variant='body1'
                  color={
                    stockData.changePercent >= 0 ? 'success.main' : 'error.main'
                  }
                >
                  ({formatPercent(stockData.changePercent)})
                </Typography>
              </Box>
            </Box>
          </Box>

          <IconButton aria-label='more options' onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab icon={<InfoIcon />} label='Overview' />
          <Tab icon={<DescriptionIcon />} label='News' />
        </Tabs>
      </Paper>

      {activeTab === 0 ? renderOverview() : renderNews()}

      {/* Options Menu */}
      <Menu
        id='stock-options-menu'
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/portfolios/add-transaction/${stockData.symbol}`)
            handleMenuClose()
          }}
        >
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Add to Portfolio</ListItemText>
        </MenuItem>
        {stockData.isInWatchlist ? (
          <MenuItem onClick={handleRemoveFromWatchlist}>
            <ListItemIcon>
              <BookmarkIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Remove from Watchlist</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setAddToWatchlistDialog(true)
              handleMenuClose()
            }}
          >
            <ListItemIcon>
              <BookmarkBorderIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Add to Watchlist</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Add to Watchlist Dialog */}
      <Dialog
        open={addToWatchlistDialog}
        onClose={() => setAddToWatchlistDialog(false)}
      >
        <DialogTitle>Add to Watchlist</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Watchlist</InputLabel>
            <Select
              value={selectedWatchlist}
              label='Select Watchlist'
              onChange={(e) => setSelectedWatchlist(e.target.value)}
            >
              {mockWatchlists.map((watchlist) => (
                <MenuItem key={watchlist.id} value={watchlist.id}>
                  {watchlist.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToWatchlistDialog(false)}>Cancel</Button>
          <Button onClick={handleAddToWatchlist} color='primary'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default StockDetail
