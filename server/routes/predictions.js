const express = require('express')
const router = express.Router()
const predictionController = require('../controllers/predictionController')

// Get stock prediction
router.get('/stocks/:symbol', predictionController.getStockPrediction)

module.exports = router
