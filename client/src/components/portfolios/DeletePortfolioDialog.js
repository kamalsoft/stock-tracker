import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material'
import { deletePortfolio } from '../../store/slices/portfolioSlice'

const DeletePortfolioDialog = ({ open, onClose, portfolio }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.portfolio)

  const handleDelete = async () => {
    if (!portfolio) return

    const resultAction = await dispatch(deletePortfolio(portfolio.id))

    if (deletePortfolio.fulfilled.match(resultAction)) {
      onClose()
    }
  }

  if (!portfolio) {
    return null
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm'>
      <DialogTitle>Delete Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant='body1' gutterBottom>
            Are you sure you want to delete the portfolio "{portfolio.name}"?
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            This action cannot be undone. All transactions associated with this
            portfolio will also be deleted.
          </Typography>

          {portfolio.holdingsCount > 0 && (
            <Alert severity='warning' sx={{ mt: 2 }}>
              This portfolio contains {portfolio.holdingsCount} holdings.
              Deleting it will remove all transaction history.
            </Alert>
          )}

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant='contained'
          color='error'
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Delete Portfolio'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePortfolioDialog
