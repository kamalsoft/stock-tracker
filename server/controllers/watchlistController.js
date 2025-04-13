const { WatchList, Stock } = require('../db/models')

// Get all watchlists for a user
exports.getWatchlists = async (req, res, next) => {
  try {
    const watchlists = await WatchList.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Stock }],
      order: [['createdAt', 'DESC']],
    })

    res.json(watchlists)
  } catch (error) {
    next(error)
  }
}

// Get watchlist details
exports.getWatchlistDetails = async (req, res, next) => {
  try {
    const { id } = req.params

    const watchlist = await WatchList.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
      include: [{ model: Stock }],
    })

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' })
    }

    res.json(watchlist)
  } catch (error) {
    next(error)
  }
}

// Create new watchlist
exports.createWatchlist = async (req, res, next) => {
  try {
    const { name, description } = req.body

    const watchlist = await WatchList.create({
      name,
      description,
      UserId: req.user.id,
    })

    res.status(201).json(watchlist)
  } catch (error) {
    next(error)
  }
}

// Update watchlist
exports.updateWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const watchlist = await WatchList.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' })
    }

    await watchlist.update({
      name: name || watchlist.name,
      description: description || watchlist.description,
    })

    res.json(watchlist)
  } catch (error) {
    next(error)
  }
}

// Delete watchlist
exports.deleteWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params

    const watchlist = await WatchList.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' })
    }

    await watchlist.destroy()

    res.json({ message: 'Watchlist deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// Add stock to watchlist
exports.addStockToWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params
    const { symbol } = req.body

    const watchlist = await WatchList.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' })
    }

    // Find or create stock
    let stock = await Stock.findOne({ where: { symbol } })

    if (!stock) {
      // Fetch stock data from API
      const response = await axios.get(
        `${process.env.STOCK_API_URL}/stock/${symbol}/quote`,
        {
          params: {
            token: process.env.STOCK_API_KEY,
          },
        }
      )

      const stockData = response.data

      stock = await Stock.create({
        symbol: stockData.symbol,
        companyName: stockData.companyName,
        currentPrice: stockData.latestPrice,
        previousClose: stockData.previousClose,
        sector: stockData.sector,
        industry: stockData.industry,
      })
    }

    // Check if stock is already in watchlist
    const exists = await watchlist.hasStock(stock)
    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' })
    }

    await watchlist.addStock(stock)

    res.json({ message: 'Stock added to watchlist successfully' })
  } catch (error) {
    next(error)
  }
}

// Remove stock from watchlist
exports.removeStockFromWatchlist = async (req, res, next) => {
  try {
    const { id, symbol } = req.params

    const watchlist = await WatchList.findOne({
      where: {
        id,
        UserId: req.user.id,
      },
    })

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' })
    }

    const stock = await Stock.findOne({ where: { symbol } })

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    // Check if stock is in watchlist
    const exists = await watchlist.hasStock(stock)
    if (!exists) {
      return res.status(400).json({ message: 'Stock not in watchlist' })
    }

    await watchlist.removeStock(stock)

    res.json({ message: 'Stock removed from watchlist successfully' })
  } catch (error) {
    next(error)
  }
}
