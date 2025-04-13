import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  ShowChart as ShowChartIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import {
  fetchStockDetails,
  fetchStockHistory,
} from '../../store/slices/stockSlice'
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../../store/slices/watchlistSlice'
import { addTransaction } from '../../store/slices/transactionSlice'
import { fetchPortfolios } from '../../store/slices/portfolioSlice'
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatDate,
} from '../../utils/formatters'
import StockChart from '../../components/stocks/StockChart'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const StockDetail = () => {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    stockDetails,
    stockHistory,
    loading: stockLoading,
  } = useSelector((state) => state.stock)
  const { watchlist, loading: watchlistLoading } = useSelector(
    (state) => state.watchlist
  )
  const { portfolios, loading: portfoliosLoading } = useSelector(
    (state) => state.portfolio
  )
  const { loading: transactionLoading } = useSelector(
    (state) => state.transaction
  )

  const [tabValue, setTabValue] = useState(0)
  const [timeRange, setTimeRange] = useState('1M') // 1D, 1W, 1M, 3M, 1Y, 5Y
  const [inWatchlist, setInWatchlist] = useState(false)
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false)

  // Trade form state
  const [tradeType, setTradeType] = useState('buy')
  const [portfolioId, setPortfolioId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [tradeDate, setTradeDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (symbol) {
      dispatch(fetchStockDetails(symbol))
      dispatch(fetchStockHistory({ symbol, range: timeRange }))
      dispatch(fetchPortfolios())
    }
  }, [dispatch, symbol, timeRange])

  useEffect(() => {
    // Check if stock is in watchlist
    if (watchlist && watchlist.length > 0) {
      const found = watchlist.some((item) => item.symbol === symbol)
      setInWatchlist(found)
    }
  }, [watchlist, symbol])

  useEffect(() => {
    // Set initial price from stock details
    if (stockDetails && stockDetails.price) {
      setPrice(stockDetails.price.toFixed(2))
    }
  }, [stockDetails])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      dispatch(removeFromWatchlist(symbol))
    } else {
      dispatch(
        addToWatchlist({
          symbol,
          name: stockDetails?.name || '',
        })
      )
    }
  }

  const handleTradeDialogOpen = () => {
    // Set default portfolio if available
    if (portfolios && portfolios.length > 0) {
      setPortfolioId(portfolios[0].id)
    }
    setTradeDialogOpen(true)
  }

  const handleTradeDialogClose = () => {
    setTradeDialogOpen(false)
    resetTradeForm()
  }

  const resetTradeForm = () => {
    setTradeType('buy')
    setPortfolioId(portfolios && portfolios.length > 0 ? portfolios[0].id : '')
    setQuantity('')
    setPrice(stockDetails?.price ? stockDetails.price.toFixed(2) : '')
    setTradeDate(new Date())
    setNotes('')
    setFormErrors({})
  }

  const validateTradeForm = () => {
    const errors = {}

    if (!portfolioId) {
      errors.portfolioId = 'Please select a portfolio'
    }

    if (!quantity || quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0'
    }

    if (!price || price <= 0) {
      errors.price = 'Price must be greater than 0'
    }

    if (!tradeDate) {
      errors.date = 'Please select a date'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleTradeSubmit = () => {
    if (validateTradeForm()) {
      const transactionData = {
        portfolioId,
        type: tradeType,
        symbol,
        name: stockDetails?.name || '',
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        date: tradeDate,
        notes,
      }

      dispatch(addTransaction(transactionData))
        .unwrap()
        .then(() => {
          handleTradeDialogClose()
        })
        .catch((error) => {
          setFormErrors({
            submit: error.message || 'Failed to add transaction',
          })
        })
    }
  }

  if (stockLoading && !stockDetails) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!stockDetails) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6'>Stock not found</Typography>
        </Paper>
      </Container>
    )
  }

  const isPositive = (stockDetails.change || 0) >= 0
  const totalValue = quantity && price ? quantity * price : 0

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Box>
          <IconButton
            color={inWatchlist ? 'primary' : 'default'}
            onClick={handleToggleWatchlist}
            disabled={watchlistLoading}
            sx={{ mr: 1 }}
          >
            {inWatchlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleTradeDialogOpen}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant='h4' component='h1' sx={{ mr: 2 }}>
                {stockDetails.symbol}
              </Typography>
              <Chip label={stockDetails.exchange} size='small' />
            </Box>
            <Typography variant='h6' color='text.secondary' gutterBottom>
              {stockDetails.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {stockDetails.sector && `${stockDetails.sector} • `}
              {stockDetails.industry}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: 'left', md: 'right' } }}
          >
            <Typography variant='h4' component='div'>
              {formatCurrency(stockDetails.price)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {isPositive ? (
                <TrendingUpIcon color='success' sx={{ mr: 1 }} />
              ) : (
                <TrendingDownIcon color='error' sx={{ mr: 1 }} />
              )}
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
                sx={{ mr: 1 }}
              >
                {formatCurrency(stockDetails.change)}
              </Typography>
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
              >
                ({formatPercent(stockDetails.changePercent / 100)})
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary'>
              Last updated: {formatDate(stockDetails.lastUpdated, 'full')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='stock tabs'
          >
            <Tab
              icon={<ShowChartIcon />}
              label='Chart'
              id='stock-tab-0'
              aria-controls='stock-tabpanel-0'
            />
            <Tab
              icon={<InfoIcon />}
              label='Overview'
              id='stock-tab-1'
              aria-controls='stock-tabpanel-1'
            />
            <Tab
              icon={<DescriptionIcon />}
              label='Financials'
              id='stock-tab-2'
              aria-controls='stock-tabpanel-2'
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Chart Tab */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((range) => (
                <Button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  variant={timeRange === range ? 'contained' : 'text'}
                  size='small'
                  sx={{ minWidth: 40, mx: 0.5 }}
                >
                  {range}
                </Button>
              ))}
            </Box>

            <Box sx={{ height: 400 }}>
              {stockHistory && stockHistory.length > 0 ? (
                <StockChart data={stockHistory} isPositive={isPositive} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Overview Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Key Statistics
                  </Typography>
                  <TableContainer>
                    <Table size='small'>
                      <TableBody>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Market Cap
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.marketCap)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            P/E Ratio
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.pe
                              ? stockDetails.pe.toFixed(2)
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            EPS
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.eps
                              ? formatCurrency(stockDetails.eps)
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Dividend Yield
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.dividendYield
                              ? formatPercent(stockDetails.dividendYield / 100)
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            52 Week High
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.high52Week)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            52 Week Low
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.low52Week)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Average Volume
                          </TableCell>
                          <TableCell align='right'>
                            {formatNumber(stockDetails.avgVolume)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    About {stockDetails.name}
                  </Typography>
                  <Typography variant='body2' paragraph>
                    {stockDetails.description || 'No description available.'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant='subtitle2' gutterBottom>
                    Company Information
                  </Typography>
                  <TableContainer>
                    <Table size='small'>
                      <TableBody>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Sector
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.sector || 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Industry
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.industry || 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            CEO
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.ceo || 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Employees
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.employees
                              ? formatNumber(stockDetails.employees, 0)
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Website
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.website ? (
                              <a
                                href={stockDetails.website}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                {stockDetails.website
                                  .replace(/^https?:\/\//, '')
                                  .replace(/\/$/, '')}
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Financials Tab */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Income Statement
              </Typography>
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align='right'>
                        FY {new Date().getFullYear() - 1}
                      </TableCell>
                      <TableCell align='right'>
                        FY {new Date().getFullYear() - 2}
                      </TableCell>
                      <TableCell align='right'>
                        FY {new Date().getFullYear() - 3}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockDetails.financials ? (
                      <>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Revenue
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.financials.revenue)}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.revenuePriorYear
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.revenuePrior2Years
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Gross Profit
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.grossProfit
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.grossProfitPriorYear
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.grossProfitPrior2Years
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Net Income
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.financials.netIncome)}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.netIncomePriorYear
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.netIncomePrior2Years
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            EPS
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(stockDetails.financials.eps)}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.epsPriorYear
                            )}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.epsPrior2Years
                            )}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align='center'>
                          Financial data not available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Balance Sheet
              </Typography>
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align='right'>Most Recent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockDetails.financials ? (
                      <>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Total Assets
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.totalAssets
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Total Liabilities
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.totalLiabilities
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Total Equity
                          </TableCell>
                          <TableCell align='right'>
                            {formatCurrency(
                              stockDetails.financials.totalEquity
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component='th' scope='row'>
                            Debt to Equity
                          </TableCell>
                          <TableCell align='right'>
                            {stockDetails.financials.debtToEquity?.toFixed(2) ||
                              'N/A'}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align='center'>
                          Balance sheet data not available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add Transaction Dialog */}
      <Dialog
        open={tradeDialogOpen}
        onClose={handleTradeDialogClose}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Add Transaction for {stockDetails.symbol}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(formErrors.portfolioId)}>
                  <InputLabel id='portfolio-select-label'>Portfolio</InputLabel>
                  <Select
                    labelId='portfolio-select-label'
                    id='portfolio-select'
                    value={portfolioId}
                    label='Portfolio'
                    onChange={(e) => setPortfolioId(e.target.value)}
                  >
                    {portfoliosLoading ? (
                      <MenuItem disabled>Loading portfolios...</MenuItem>
                    ) : portfolios && portfolios.length > 0 ? (
                      portfolios.map((portfolio) => (
                        <MenuItem key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No portfolios available</MenuItem>
                    )}
                  </Select>
                  {formErrors.portfolioId && (
                    <FormHelperText>{formErrors.portfolioId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='trade-type-label'>
                    Transaction Type
                  </InputLabel>
                  <Select
                    labelId='trade-type-label'
                    id='trade-type'
                    value={tradeType}
                    label='Transaction Type'
                    onChange={(e) => setTradeType(e.target.value)}
                  >
                    <MenuItem value='buy'>Buy</MenuItem>
                    <MenuItem value='sell'>Sell</MenuItem>
                    <MenuItem value='dividend'>Dividend</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Quantity'
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={Boolean(formErrors.quantity)}
                  helperText={formErrors.quantity}
                  inputProps={{ step: '0.0001', min: '0' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Price per Share'
                  type='number'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={Boolean(formErrors.price)}
                  helperText={formErrors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>$</InputAdornment>
                    ),
                  }}
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant='body1'>Total Value:</Typography>
                  <Typography
                    variant='h6'
                    color={tradeType === 'buy' ? 'error.main' : 'success.main'}
                  >
                    {tradeType === 'buy' ? '-' : '+'}
                    {formatCurrency(totalValue)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Notes (optional)'
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>

              {formErrors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{formErrors.submit}</FormHelperText>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTradeDialogClose}>Cancel</Button>
          <Button
            variant='contained'
            onClick={handleTradeSubmit}
            disabled={transactionLoading}
          >
            {transactionLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Add Transaction'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default StockDetail
