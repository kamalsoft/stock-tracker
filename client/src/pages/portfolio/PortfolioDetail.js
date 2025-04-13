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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import {
  fetchPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from '../../store/slices/portfolioSlice'
import { fetchTransactionsByPortfolio } from '../../store/slices/transactionSlice'
import {
  formatCurrency,
  formatPercent,
  formatDate,
} from '../../utils/formatters'
import TransactionList from '../../components/transactions/TransactionList'
import AddTransactionForm from '../../components/transactions/AddTransactionForm'
import EditTransactionForm from '../../components/transactions/EditTransactionForm'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`portfolio-tabpanel-${index}`}
      aria-labelledby={`portfolio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const PortfolioDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentPortfolio, loading: portfolioLoading } = useSelector(
    (state) => state.portfolio
  )
  const { transactions, loading: transactionsLoading } = useSelector(
    (state) => state.transaction
  )

  const [tabValue, setTabValue] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [portfolioName, setPortfolioName] = useState('')
  const [portfolioDescription, setPortfolioDescription] = useState('')
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [editTransactionId, setEditTransactionId] = useState(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchPortfolioById(id))
      dispatch(fetchTransactionsByPortfolio(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentPortfolio) {
      setPortfolioName(currentPortfolio.name || '')
      setPortfolioDescription(currentPortfolio.description || '')
    }
  }, [currentPortfolio])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleEditOpen = () => {
    setEditDialogOpen(true)
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
  }

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
  }

  const handleEditSubmit = () => {
    dispatch(
      updatePortfolio({
        id,
        name: portfolioName,
        description: portfolioDescription,
      })
    )
    setEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    dispatch(deletePortfolio(id))
    setDeleteDialogOpen(false)
    navigate('/dashboard')
  }

  const handleAddTransactionOpen = () => {
    setAddTransactionOpen(true)
  }

  const handleAddTransactionClose = () => {
    setAddTransactionOpen(false)
  }

  const handleEditTransaction = (transactionId) => {
    setEditTransactionId(transactionId)
  }

  const handleEditTransactionClose = () => {
    setEditTransactionId(null)
  }

  if (portfolioLoading && !currentPortfolio) {
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

  if (!currentPortfolio) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6'>Portfolio not found</Typography>
        </Paper>
      </Container>
    )
  }

  // Calculate portfolio statistics
  const totalValue = currentPortfolio.totalValue || 0
  const totalCost = currentPortfolio.totalCost || 0
  const totalGain = totalValue - totalCost
  const totalGainPercent = totalCost > 0 ? totalGain / totalCost : 0
  const isPositive = totalGain >= 0

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
          Back to Dashboard
        </Button>
        <Box>
          <IconButton color='primary' onClick={handleEditOpen} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton color='error' onClick={handleDeleteOpen}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant='h4' component='h1' gutterBottom>
              {currentPortfolio.name}
            </Typography>
            {currentPortfolio.description && (
              <Typography variant='body1' color='text.secondary' paragraph>
                {currentPortfolio.description}
              </Typography>
            )}
            <Typography variant='caption' color='text.secondary'>
              Created: {formatDate(currentPortfolio.createdAt, 'full')}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ textAlign: { xs: 'left', md: 'right' } }}
          >
            <Typography variant='h4' component='div'>
              {formatCurrency(totalValue)}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
                sx={{ mr: 1 }}
              >
                {formatCurrency(totalGain)}
              </Typography>
              <Typography
                variant='body1'
                color={isPositive ? 'success.main' : 'error.main'}
              >
                ({formatPercent(totalGainPercent)})
              </Typography>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              Total Cost: {formatCurrency(totalCost)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='portfolio tabs'
          >
            <Tab
              label='Holdings'
              id='portfolio-tab-0'
              aria-controls='portfolio-tabpanel-0'
            />
            <Tab
              label='Transactions'
              id='portfolio-tab-1'
              aria-controls='portfolio-tabpanel-1'
            />
            <Tab
              label='Performance'
              id='portfolio-tab-2'
              aria-controls='portfolio-tabpanel-2'
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Holdings tab content */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1' paragraph>
              Your portfolio holdings will be displayed here.
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Add transactions to see your holdings.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Transactions tab content */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddTransactionOpen}
            >
              Add Transaction
            </Button>
          </Box>

          {transactionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : transactions && transactions.length > 0 ? (
            <TransactionList
              transactions={transactions}
              onEditTransaction={handleEditTransaction}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1'>
                No transactions found for this portfolio.
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                Click "Add Transaction" to get started.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Performance tab content */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1' paragraph>
              Your portfolio performance will be displayed here.
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Add transactions to see your performance over time.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>

      {/* Edit Portfolio Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Portfolio Name'
            type='text'
            fullWidth
            variant='outlined'
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Description (optional)'
            type='text'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            value={portfolioDescription}
            onChange={(e) => setPortfolioDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Portfolio Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            Are you sure you want to delete this portfolio? This action cannot
            be undone.
          </Typography>
          <Typography variant='body2' color='error' sx={{ mt: 2 }}>
            All transactions associated with this portfolio will also be
            deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            variant='contained'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog
        open={addTransactionOpen}
        onClose={handleAddTransactionClose}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <AddTransactionForm
            portfolioId={id}
            onSuccess={handleAddTransactionClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTransactionClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Transaction Dialog */}
      {editTransactionId && (
        <Dialog
          open={Boolean(editTransactionId)}
          onClose={handleEditTransactionClose}
          maxWidth='md'
          fullWidth
        >
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogContent>
            <EditTransactionForm
              transactionId={editTransactionId}
              onSuccess={handleEditTransactionClose}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditTransactionClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  )
}

export default PortfolioDetail
