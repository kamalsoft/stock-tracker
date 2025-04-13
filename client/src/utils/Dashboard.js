import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Typography, Button, Box, CircularProgress } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import PortfolioCard from '../components/portfolios/PortfolioCard'
import CreatePortfolioDialog from '../components/portfolios/CreatePortfolioDialog'
import { fetchUserPortfolios } from '../store/slices/portfolioSlice'
import useLogger from '../utils/useLogger'
import logger from '../utils/logger'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { portfolios, loading, error } = useSelector((state) => state.portfolio)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [editingPortfolio, setEditingPortfolio] = useState(null)

  // Use our custom logger hook
  useLogger('Dashboard')

  useEffect(() => {
    logger.time('Dashboard - Fetch Portfolios')
    dispatch(fetchUserPortfolios())
      .then(() => {
        logger.timeEnd('Dashboard - Fetch Portfolios')
      })
      .catch((err) => {
        logger.error('Failed to fetch portfolios', err)
        logger.timeEnd('Dashboard - Fetch Portfolios')
      })
  }, [dispatch])

  const handleOpenCreateDialog = () => {
    setEditingPortfolio(null)
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
  }

  const handleEditPortfolio = (portfolio) => {
    logger.log('Editing portfolio', portfolio)
    setEditingPortfolio(portfolio)
    setOpenCreateDialog(true)
  }

  const handleDeletePortfolio = (portfolio) => {
    logger.log('Deleting portfolio', portfolio)
    // Implement delete functionality
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant='h4' component='h1'>
          My Portfolios
        </Typography>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Create Portfolio
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color='error' sx={{ mt: 2 }}>
          Error loading portfolios: {error}
        </Typography>
      ) : portfolios.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant='h6' color='textSecondary' gutterBottom>
            You don't have any portfolios yet.
          </Typography>
          <Typography variant='body1' color='textSecondary' paragraph>
            Create your first portfolio to start tracking your investments.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ mt: 2 }}
          >
            Create Portfolio
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {portfolios.map((portfolio) => (
            <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
              <PortfolioCard
                portfolio={portfolio}
                onEdit={() => handleEditPortfolio(portfolio)}
                onDelete={() => handleDeletePortfolio(portfolio)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreatePortfolioDialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        portfolio={editingPortfolio}
      />
    </Box>
  )
}

export default Dashboard
