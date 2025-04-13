const axios = require('axios')
const { Stock } = require('../db/models')

// Search stocks
exports.searchStocks = async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    // Search in local database first
    const localStocks = await Stock.findAll({
      where: {
        [sequelize.Op.or]: [
          { symbol: { [sequelize.Op.like]: `%${query}%` } },
          { companyName: { [sequelize.Op.like]: `%${query}%` } },
        ],
      },
      limit: 10,
    })

    // If we have enough results, return them
    if (localStocks.length >= 5) {
      return res.json(localStocks)
    }

    // Otherwise, fetch from external API
    // Note: In a real app, you would use a proper API key and service
    const response = await axios.get(`${process.env.STOCK_API_URL}/search`, {
      params: {
        q: query,
        token: process.env.STOCK_API_KEY,
      },
    })

    const externalStocks = response.data.results || []

    // Combine and format results
    const formattedExternalStocks = externalStocks.map((stock) => ({
      symbol: stock.symbol,
      companyName: stock.name,
      sector: stock.sector || null,
      industry: stock.industry || null,
    }))

    // Save new stocks to database
    for (const stock of formattedExternalStocks) {
      await Stock.findOrCreate({
        where: { symbol: stock.symbol },
        defaults: stock,
      })
    }

    // Combine local and external results, removing duplicates
    const allStocks = [...localStocks]
    for (const stock of formattedExternalStocks) {
      if (!allStocks.some((s) => s.symbol === stock.symbol)) {
        allStocks.push(stock)
      }
    }

    res.json(allStocks.slice(0, 10))
  } catch (error) {
    next(error)
  }
}

// Get stock details
exports.getStockDetails = async (req, res, next) => {
  try {
    const { symbol } = req.params

    // Check if stock exists in database
    let stock = await Stock.findOne({ where: { symbol } })

    // If stock exists and was updated recently, return it
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (stock && stock.lastUpdated > oneHourAgo) {
      return res.json(stock)
    }

    // Otherwise, fetch from external API
    const response = await axios.get(`${process.env.STOCK_API_URL}/quote`, {
      params: {
        symbol,
        token: process.env.STOCK_API_KEY,
      },
    })

    const stockData = response.data

    // Update or create stock in database
    const stockDetails = {
      symbol: stockData.symbol,
      companyName: stockData.companyName,
      currentPrice: stockData.latestPrice,
      previousClose: stockData.previousClose,
      open: stockData.open,
      dayHigh: stockData.high,
      dayLow: stockData.low,
      volume: stockData.volume,
      marketCap: stockData.marketCap,
      peRatio: stockData.peRatio,
      dividend: stockData.dividend,
      dividendYield: stockData.dividendYield,
      eps: stockData.eps,
      beta: stockData.beta,
      fiftyTwoWeekHigh: stockData.week52High,
      fiftyTwoWeekLow: stockData.week52Low,
      sector: stockData.sector,
      industry: stockData.industry,
      lastUpdated: new Date(),
    }

    if (stock) {
      await stock.update(stockDetails)
    } else {
      stock = await Stock.create(stockDetails)
    }

    res.json(stock)
  } catch (error) {
    next(error)
  }
}

// Get stock historical data
exports.getStockHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params
    const { range = '1m' } = req.query

    // Validate range
    const validRanges = ['1d', '5d', '1m', '3m', '6m', '1y', '2y', '5y']
    if (!validRanges.includes(range)) {
      return res.status(400).json({ message: 'Invalid range parameter' })
    }

    // Fetch from external API
    const response = await axios.get(
      `${process.env.STOCK_API_URL}/stock/${symbol}/chart/${range}`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
        },
      }
    )

    const historicalData = response.data.map((item) => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }))

    res.json(historicalData)
  } catch (error) {
    next(error)
  }
}

// Get market overview
exports.getMarketOverview = async (req, res, next) => {
  try {
    // Fetch major indices
    const indices = ['SPY', 'QQQ', 'DIA', 'IWM']
    const indicesData = []

    for (const symbol of indices) {
      const response = await axios.get(`${process.env.STOCK_API_URL}/quote`, {
        params: {
          symbol,
          token: process.env.STOCK_API_KEY,
        },
      })

      indicesData.push({
        symbol,
        name: response.data.companyName,
        price: response.data.latestPrice,
        change: response.data.change,
        changePercent: response.data.changePercent,
      })
    }

    // Get top gainers and losers
    const marketResponse = await axios.get(
      `${process.env.STOCK_API_URL}/market/list/gainers`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
          listLimit: 5,
        },
      }
    )

    const gainers = marketResponse.data.map((stock) => ({
      symbol: stock.symbol,
      companyName: stock.companyName,
      price: stock.latestPrice,
      change: stock.change,
      changePercent: stock.changePercent,
    }))

    const losersResponse = await axios.get(
      `${process.env.STOCK_API_URL}/market/list/losers`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
          listLimit: 5,
        },
      }
    )

    const losers = losersResponse.data.map((stock) => ({
      symbol: stock.symbol,
      companyName: stock.companyName,
      price: stock.latestPrice,
      change: stock.change,
      changePercent: stock.changePercent,
    }))

    res.json({
      indices: indicesData,
      gainers,
      losers,
      timestamp: new Date(),
    })
  } catch (error) {
    next(error)
  }
}
