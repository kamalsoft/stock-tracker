const { Portfolio, Transaction, Stock } = require('../db/models')
const sequelize = require('sequelize')

// Get all portfolios for a user
exports.getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    })

    res.json(portfolios)
  } catch (error) {
    next(error)
  }
}

// Get portfolio details
exports.getPortfolioDetails = async (req, res, next) => {
  try {
    const { id } = req.params

    const portfolio = await Portfolio.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
      include: [
        {
          model: Transaction,
          attributes: [
            'stockSymbol',
            [
              sequelize.fn(
                'SUM',
                sequelize.literal(
                  'CASE WHEN "type" = \'BUY\' THEN quantity ELSE -quantity END'
                )
              ),
              'totalShares',
            ],
            [
              sequelize.fn(
                'SUM',
                sequelize.literal(
                  'CASE WHEN "type" = \'BUY\' THEN totalAmount ELSE -totalAmount END'
                )
              ),
              'totalInvested',
            ],
          ],
          group: ['stockSymbol'],
        },
      ],
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    // Get current prices for all stocks in portfolio
    const stockSymbols = [
      ...new Set(portfolio.Transactions.map((t) => t.stockSymbol)),
    ]
    const stockPrices = {}

    for (const symbol of stockSymbols) {
      const stock = await Stock.findOne({ where: { symbol } })
      stockPrices[symbol] = stock ? stock.currentPrice : 0
    }

    // Calculate current values and performance
    const holdings = portfolio.Transactions.map((transaction) => {
      const currentPrice = stockPrices[transaction.stockSymbol] || 0
      const totalShares = parseFloat(transaction.dataValues.totalShares) || 0
      const totalInvested =
        parseFloat(transaction.dataValues.totalInvested) || 0
      const currentValue = totalShares * currentPrice
      const profit = currentValue - totalInvested
      const profitPercentage =
        totalInvested > 0 ? (profit / totalInvested) * 100 : 0

      return {
        symbol: transaction.stockSymbol,
        shares: totalShares,
        averagePrice: totalShares > 0 ? totalInvested / totalShares : 0,
        totalInvested,
        currentPrice,
        currentValue,
        profit,
        profitPercentage,
      }
    }).filter((holding) => holding.shares > 0)

    // Calculate portfolio totals
    const totalInvested = holdings.reduce(
      (sum, holding) => sum + holding.totalInvested,
      0
    )
    const currentValue =
      holdings.reduce((sum, holding) => sum + holding.currentValue, 0) +
      portfolio.cashBalance
    const totalProfit =
      currentValue - totalInvested - portfolio.initialInvestment
    const totalProfitPercentage =
      portfolio.initialInvestment > 0
        ? (totalProfit / portfolio.initialInvestment) * 100
        : 0

    // Update portfolio current value
    await portfolio.update({ currentValue })

    res.json({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      initialInvestment: portfolio.initialInvestment,
      currentValue,
      cashBalance: portfolio.cashBalance,
      totalProfit,
      totalProfitPercentage,
      holdings,
      createdAt: portfolio.createdAt,
    })
  } catch (error) {
    next(error)
  }
}

// Create new portfolio
exports.createPortfolio = async (req, res, next) => {
  try {
    const { name, description, initialInvestment = 0 } = req.body

    const portfolio = await Portfolio.create({
      name,
      description,
      initialInvestment,
      cashBalance: initialInvestment,
      currentValue: initialInvestment,
      UserId: req.user.id,
    })

    res.status(201).json(portfolio)
  } catch (error) {
    next(error)
  }
}

// Update portfolio
exports.updatePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const portfolio = await Portfolio.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    await portfolio.update({
      name: name || portfolio.name,
      description: description || portfolio.description,
    })

    res.json(portfolio)
  } catch (error) {
    next(error)
  }
}

// Delete portfolio
exports.deletePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params

    const portfolio = await Portfolio.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    await portfolio.destroy()

    res.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// Add funds to portfolio
exports.addFunds = async (req, res, next) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const portfolio = await Portfolio.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    await portfolio.update({
      cashBalance: portfolio.cashBalance + amount,
      currentValue: portfolio.currentValue + amount,
    })

    res.json(portfolio)
  } catch (error) {
    next(error)
  }
}

// Withdraw funds from portfolio
exports.withdrawFunds = async (req, res, next) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const portfolio = await Portfolio.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    if (portfolio.cashBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' })
    }

    await portfolio.update({
      cashBalance: portfolio.cashBalance - amount,
      currentValue: portfolio.currentValue - amount,
    })

    res.json(portfolio)
  } catch (error) {
    next(error)
  }
}
