const express = require('express')
const router = express.Router()
const analysisController = require('../controllers/analysisController')

// Get stock analysis
router.get('/stocks/:symbol', analysisController.getStockAnalysis)

// Compare stocks
router.get('/compare', analysisController.compareStocks)

// Get sector performance
router.get('/sectors', analysisController.getSectorPerformance)

module.exports = router
