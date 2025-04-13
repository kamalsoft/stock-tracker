import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { deleteTransaction } from '../../store/slices/transactionSlice'
import EditTransactionForm from '../transactions/EditTransactionForm'

const PortfolioTransactions = ({ transactions, portfolioId }) => {
  const dispatch = useDispatch()
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant='body1'>
          No transactions in this portfolio yet.
        </Typography>
      </Box>
    )
  }

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
    setSelectedTransaction(null)
  }

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenDeleteDialog(true)
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false)
    setSelectedTransaction(null)
  }

  const handleDeleteConfirm = () => {
    if (selectedTransaction) {
      dispatch(deleteTransaction(selectedTransaction.id))
      setOpenDeleteDialog(false)
      setSelectedTransaction(null)
    }
  }

  const getTransactionTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return 'success'
      case 'sell':
        return 'error'
      case 'dividend':
        return 'info'
      case 'deposit':
        return 'primary'
      case 'withdrawal':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label='transactions table'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align='right'>Shares</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='right'>Total</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    color={getTransactionTypeColor(transaction.type)}
                    size='small'
                  />
                </TableCell>
                <TableCell>{transaction.symbol || '-'}</TableCell>
                <TableCell align='right'>
                  {transaction.shares ? transaction.shares.toFixed(2) : '-'}
                </TableCell>
                <TableCell align='right'>
                  {transaction.price ? formatCurrency(transaction.price) : '-'}
                </TableCell>
                <TableCell align='right'>
                  {formatCurrency(transaction.total)}
                </TableCell>
                <TableCell align='right'>
                  <IconButton
                    size='small'
                    onClick={() => handleEditClick(transaction)}
                  >
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    color='error'
                    onClick={() => handleDeleteClick(transaction)}
                  >
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Transaction Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <EditTransactionForm
              transaction={selectedTransaction}
              portfolioId={portfolioId}
              onClose={handleEditClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PortfolioTransactions
