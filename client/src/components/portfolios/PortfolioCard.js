import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShowChart as ShowChartIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { deletePortfolio } from '../../store/slices/portfolioSlice'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import logger from '../../utils/logger'

const PortfolioCard = ({ portfolio, onEdit }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    onEdit(portfolio)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      logger.time(`Delete portfolio ${portfolio.id}`)
      await dispatch(deletePortfolio(portfolio.id)).unwrap()
      logger.log(`Portfolio ${portfolio.id} deleted successfully`)
    } catch (error) {
      logger.error(`Failed to delete portfolio ${portfolio.id}`, error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      logger.timeEnd(`Delete portfolio ${portfolio.id}`)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleViewClick = () => {
    logger.log(`Navigating to portfolio ${portfolio.id}`)
    navigate(`/portfolios/${portfolio.id}`)
  }

  const handleAddTransactionClick = () => {
    logger.log(`Navigating to add transaction for portfolio ${portfolio.id}`)
    navigate(`/portfolios/${portfolio.id}/add-transaction`)
  }

  // Calculate if portfolio is positive or negative
  const isPositive = (portfolio.performance?.percentChange || 0) >= 0

  return (
    <>
      <Card
        variant='outlined'
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Typography
              variant='h6'
              component='div'
              noWrap
              sx={{ maxWidth: '80%' }}
            >
              {portfolio.name}
            </Typography>
            <IconButton
              aria-label='portfolio options'
              aria-controls='portfolio-menu'
              aria-haspopup='true'
              onClick={handleMenuClick}
              size='small'
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='portfolio-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'portfolio-options-button',
              }}
            >
              <MenuItem onClick={handleEditClick}>
                <ListItemIcon>
                  <EditIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <ListItemIcon>
                  <DeleteIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {portfolio.description || 'No description'}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant='h5' component='div'>
              {formatCurrency(portfolio.totalValue || 0, portfolio.currency)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              {isPositive ? (
                <TrendingUpIcon
                  color='success'
                  fontSize='small'
                  sx={{ mr: 0.5 }}
                />
              ) : (
                <TrendingDownIcon
                  color='error'
                  fontSize='small'
                  sx={{ mr: 0.5 }}
                />
              )}
              <Typography
                variant='body2'
                color={isPositive ? 'success.main' : 'error.main'}
              >
                {formatCurrency(
                  portfolio.performance?.valueChange || 0,
                  portfolio.currency
                )}{' '}
                (
                {formatPercent(
                  (portfolio.performance?.percentChange || 0) / 100
                )}
                )
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Holdings:
            </Typography>
            <Typography variant='body2'>
              {portfolio.holdingsCount || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Cash:
            </Typography>
            <Typography variant='body2'>
              {formatCurrency(portfolio.cashBalance || 0, portfolio.currency)}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {portfolio.topHoldings && portfolio.topHoldings.length > 0 ? (
              portfolio.topHoldings
                .slice(0, 3)
                .map((holding) => (
                  <Chip
                    key={holding.symbol}
                    label={`${holding.symbol} (${formatPercent(
                      holding.allocation / 100
                    )})`}
                    size='small'
                    variant='outlined'
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))
            ) : (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontStyle: 'italic' }}
              >
                No holdings yet
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size='small'
            startIcon={<ShowChartIcon />}
            onClick={handleViewClick}
          >
            View Details
          </Button>
          <Button
            size='small'
            startIcon={<AddIcon />}
            onClick={handleAddTransactionClick}
          >
            Add Transaction
          </Button>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>Delete Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText id='delete-dialog-description'>
            Are you sure you want to delete the portfolio "{portfolio.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color='error'
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PortfolioCard
