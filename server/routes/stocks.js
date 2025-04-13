const express = require('express')
const router = express.Router()
const stockController = require('../controllers/stockController')

// Search stocks
router.get('/search', stockController.searchStocks)

// Get stock details
router.get('/:symbol', stockController.getStockDetails)

// Get stock historical data
router.get('/:symbol/history', stockController.getStockHistory)

// Get market overview
router.get('/market/overview', stockController.getMarketOverview)

module.exports = router
