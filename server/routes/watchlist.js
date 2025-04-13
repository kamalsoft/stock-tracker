const express = require('express')
const router = express.Router()
const watchlistController = require('../controllers/watchlistController')

// Get all watchlists
router.get('/', watchlistController.getWatchlists)

// Get watchlist details
router.get('/:id', watchlistController.getWatchlistDetails)

// Create new watchlist
router.post('/', watchlistController.createWatchlist)

// Update watchlist
router.put('/:id', watchlistController.updateWatchlist)

// Delete watchlist
router.delete('/:id', watchlistController.deleteWatchlist)

// Add stock to watchlist
router.post('/:id/stocks', watchlistController.addStockToWatchlist)

// Remove stock from watchlist
router.delete(
  '/:id/stocks/:symbol',
  watchlistController.removeStockFromWatchlist
)

module.exports = router
