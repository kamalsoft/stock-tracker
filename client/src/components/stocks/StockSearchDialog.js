import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

import { searchStocks, clearSearchResults } from '../../store/slices/stockSlice'

const StockSearchDialog = ({ open, onClose, onSelect }) => {
  const dispatch = useDispatch()
  const { searchResults, loading } = useSelector((state) => state.stock)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchQuery])

  // Search stocks when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      dispatch(searchStocks(debouncedQuery))
    }
  }, [debouncedQuery, dispatch])

  // Clear search results when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearSearchResults())
      setSearchQuery('')
    }
  }, [open, dispatch])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleStockSelect = (stock) => {
    onSelect(stock)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Search Stocks</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Search by company name or symbol'
          type='text'
          fullWidth
          variant='outlined'
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : searchResults && searchResults.length > 0 ? (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {searchResults.map((stock) => (
              <ListItem key={stock.symbol} disablePadding>
                <ListItemButton onClick={() => handleStockSelect(stock)}>
                  <ListItemText
                    primary={`${stock.symbol} - ${stock.name}`}
                    secondary={stock.exchange || 'Unknown Exchange'}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : debouncedQuery.trim().length > 1 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1'>
              No stocks found matching "{debouncedQuery}"
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1'>
              Enter a company name or stock symbol to search
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default StockSearchDialog
