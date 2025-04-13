const express = require('express')
const router = express.Router()
const portfolioController = require('../controllers/portfolioController')
const transactionController = require('../controllers/transactionController')

// Get all portfolios
router.get('/', portfolioController.getPortfolios)

// Get portfolio details
router.get('/:id', portfolioController.getPortfolioDetails)

// Create new portfolio
router.post('/', portfolioController.createPortfolio)

// Update portfolio
router.put('/:id', portfolioController.updatePortfolio)

// Delete portfolio
router.delete('/:id', portfolioController.deletePortfolio)

// Add funds to portfolio
router.post('/:id/funds', portfolioController.addFunds)

// Withdraw funds from portfolio
router.post('/:id/withdraw', portfolioController.withdrawFunds)

// Get all transactions for a portfolio
router.get('/:portfolioId/transactions', transactionController.getTransactions)

// Create new transaction
router.post(
  '/:portfolioId/transactions',
  transactionController.createTransaction
)

// Delete transaction
router.delete(
  '/:portfolioId/transactions/:id',
  transactionController.deleteTransaction
)

module.exports = router
