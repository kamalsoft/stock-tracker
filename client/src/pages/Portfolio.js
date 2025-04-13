import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

import {
  getPortfolios,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  clearPortfolioError,
} from '../store/slices/portfolioSlice'

// Components
import PortfolioCard from '../components/portfolio/PortfolioCard'

const Portfolio = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { portfolios, loading, error } = useSelector((state) => state.portfolio)

  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentPortfolio, setCurrentPortfolio] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PERSONAL',
  })

  useEffect(() => {
    dispatch(getPortfolios())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearPortfolioError())
    }
  }, [error, dispatch])

  const handleCreateDialogOpen = () => {
    setFormData({
      name: '',
      description: '',
      type: 'PERSONAL',
    })
    setOpenCreateDialog(true)
  }

  const handleEditDialogOpen = (portfolio) => {
    setCurrentPortfolio(portfolio)
    setFormData({
      name: portfolio.name,
      description: portfolio.description || '',
      type: portfolio.type,
    })
    setOpenEditDialog(true)
  }

  const handleDeleteDialogOpen = (portfolio) => {
    setCurrentPortfolio(portfolio)
    setOpenDeleteDialog(true)
  }

  const handleDialogClose = () => {
    setOpenCreateDialog(false)
    setOpenEditDialog(false)
    setOpenDeleteDialog(false)
    setCurrentPortfolio(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCreateSubmit = () => {
    dispatch(createPortfolio(formData))
    handleDialogClose()
  }

  const handleEditSubmit = () => {
    dispatch(
      updatePortfolio({
        id: currentPortfolio.id,
        portfolioData: formData,
      })
    )
    handleDialogClose()
  }

  const handleDeleteSubmit = () => {
    dispatch(deletePortfolio(currentPortfolio.id))
    handleDialogClose()
  }

  if (loading && portfolios.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          Your Portfolios
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Portfolio
        </Button>
      </Box>

      {portfolios.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              You don't have any portfolios yet
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Create a portfolio to track your investments and monitor
              performance
            </Typography>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleCreateDialogOpen}
            >
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
              <PortfolioCard
                portfolio={portfolio}
                onEdit={() => handleEditDialogOpen(portfolio)}
                onDelete={() => handleDeleteDialogOpen(portfolio)}
                onClick={() => navigate(`/portfolios/${portfolio.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Portfolio Dialog */}
      <Dialog open={openCreateDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a new portfolio to track your investments and monitor
            performance.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Portfolio Name'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='description'
            label='Description (Optional)'
            type='text'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin='dense'
            name='type'
            label='Portfolio Type'
            fullWidth
            variant='outlined'
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value='PERSONAL'>Personal</MenuItem>
            <MenuItem value='RETIREMENT'>Retirement</MenuItem>
            <MenuItem value='EDUCATION'>Education</MenuItem>
            <MenuItem value='INVESTMENT'>Investment</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleCreateSubmit}
            variant='contained'
            disabled={!formData.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Portfolio Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Portfolio Name'
            type='text'
            fullWidth
            variant='outlined'
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            name='description'
            label='Description (Optional)'
            type='text'
            fullWidth
            variant='outlined'
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin='dense'
            name='type'
            label='Portfolio Type'
            fullWidth
            variant='outlined'
            value={formData.type}
            onChange={handleChange}
          >
            <MenuItem value='PERSONAL'>Personal</MenuItem>
            <MenuItem value='RETIREMENT'>Retirement</MenuItem>
            <MenuItem value='EDUCATION'>Education</MenuItem>
            <MenuItem value='INVESTMENT'>Investment</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant='contained'
            disabled={!formData.name}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Portfolio Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Delete Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the portfolio "
            {currentPortfolio?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Portfolio
