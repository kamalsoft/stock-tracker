const { Transaction, Portfolio, Stock } = require('../db/models')

// Get all transactions for a portfolio
exports.getTransactions = async (req, res, next) => {
  try {
    const { portfolioId } = req.params

    // Verify portfolio belongs to user
    const portfolio = await Portfolio.findOne({
      where: {
        id: portfolioId,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    const transactions = await Transaction.findAll({
      where: { PortfolioId: portfolioId },
      order: [['transactionDate', 'DESC']],
    })

    res.json(transactions)
  } catch (error) {
    next(error)
  }
}

// Create new transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { portfolioId } = req.params
    const {
      stockSymbol,
      type,
      quantity,
      price,
      fees = 0,
      notes,
      transactionDate = new Date(),
    } = req.body

    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' })
    }

    if (quantity <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ message: 'Quantity and price must be positive' })
    }

    // Verify portfolio belongs to user
    const portfolio = await Portfolio.findOne({
      where: {
        id: portfolioId,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    // Verify stock exists
    const stock = await Stock.findOne({ where: { symbol: stockSymbol } })
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    const totalAmount = quantity * price + fees

    // For sell transactions, verify user has enough shares
    if (type === 'SELL') {
      const ownedShares =
        (await Transaction.sum('quantity', {
          where: {
            PortfolioId: portfolioId,
            stockSymbol,
            type: 'BUY',
          },
        })) -
          (await Transaction.sum('quantity', {
            where: {
              PortfolioId: portfolioId,
              stockSymbol,
              type: 'SELL',
            },
          })) || 0

      if (ownedShares < quantity) {
        return res.status(400).json({ message: 'Not enough shares to sell' })
      }
    } else if (type === 'BUY') {
      // For buy transactions, verify user has enough cash
      if (portfolio.cashBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient funds' })
      }
    }

    // Create transaction
    const transaction = await Transaction.create({
      stockSymbol,
      type,
      quantity,
      price,
      totalAmount,
      fees,
      notes,
      transactionDate,
      PortfolioId: portfolioId,
    })

    // Update portfolio cash balance
    if (type === 'BUY') {
      await portfolio.update({
        cashBalance: portfolio.cashBalance - totalAmount,
      })
    } else {
      await portfolio.update({
        cashBalance: portfolio.cashBalance + totalAmount,
      })
    }

    res.status(201).json(transaction)
  } catch (error) {
    next(error)
  }
}

// Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id, portfolioId } = req.params

    // Verify portfolio belongs to user
    const portfolio = await Portfolio.findOne({
      where: {
        id: portfolioId,
        UserId: req.user.id,
      },
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    const transaction = await Transaction.findOne({
      where: {
        id,
        PortfolioId: portfolioId,
      },
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Revert portfolio cash balance
    if (transaction.type === 'BUY') {
      await portfolio.update({
        cashBalance: portfolio.cashBalance + transaction.totalAmount,
      })
    } else {
      // For sell transactions, verify user has enough cash to revert
      if (portfolio.cashBalance < transaction.totalAmount) {
        return res
          .status(400)
          .json({
            message: 'Cannot delete transaction: insufficient funds to revert',
          })
      }

      await portfolio.update({
        cashBalance: portfolio.cashBalance - transaction.totalAmount,
      })
    }

    await transaction.destroy()

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    next(error)
  }
}
