import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { deleteTransaction } from '../../store/slices/transactionSlice'
import { formatCurrency, formatDate } from '../../utils/formatters'

const getTransactionTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case 'buy':
      return 'primary'
    case 'sell':
      return 'secondary'
    case 'dividend':
      return 'success'
    case 'deposit':
      return 'info'
    case 'withdrawal':
      return 'warning'
    default:
      return 'default'
  }
}

const TransactionList = ({ transactions, onEditTransaction }) => {
  const dispatch = useDispatch()

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id))
    }
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell align='right'>Price</TableCell>
            <TableCell align='right'>Total</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => {
            const total = transaction.price * transaction.quantity

            return (
              <TableRow key={transaction.id}>
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
                <TableCell>
                  <Typography variant='body2' fontWeight='bold'>
                    {transaction.symbol}
                  </Typography>
                  {transaction.name && (
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      display='block'
                    >
                      {transaction.name}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell align='right'>
                  {formatCurrency(transaction.price)}
                </TableCell>
                <TableCell align='right'>
                  <Typography
                    variant='body2'
                    fontWeight='medium'
                    color={
                      transaction.type.toLowerCase() === 'buy' ||
                      transaction.type.toLowerCase() === 'deposit'
                        ? 'error.main'
                        : 'success.main'
                    }
                  >
                    {transaction.type.toLowerCase() === 'buy' ||
                    transaction.type.toLowerCase() === 'deposit'
                      ? '-'
                      : '+'}
                    {formatCurrency(Math.abs(total))}
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => onEditTransaction(transaction.id)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      color='error'
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TransactionList
