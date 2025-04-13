const { Stock, StockAnalysis } = require('../db/models')
const axios = require('axios')
const technicalIndicators = require('technicalindicators')
const moment = require('moment')

// Get stock analysis
exports.getStockAnalysis = async (req, res, next) => {
  try {
    const { symbol } = req.params
    const { period = '1m' } = req.query

    // Validate period
    const validPeriods = ['1d', '5d', '1m', '3m', '6m', '1y', '2y', '5y']
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: 'Invalid period parameter' })
    }

    // Check if we have a recent analysis
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existingAnalysis = await StockAnalysis.findOne({
      where: {
        period,
        '$Stock.symbol$': symbol,
        createdAt: { [sequelize.Op.gt]: oneDayAgo },
      },
      include: [{ model: Stock }],
    })

    if (existingAnalysis) {
      return res.json(existingAnalysis)
    }

    // Get stock
    const stock = await Stock.findOne({ where: { symbol } })
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    // Get historical data
    const response = await axios.get(
      `${process.env.STOCK_API_URL}/stock/${symbol}/chart/${period}`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
        },
      }
    )

    const historicalData = response.data

    // Calculate analysis metrics
    const prices = historicalData.map((item) => item.close)
    const volumes = historicalData.map((item) => item.volume)
    const dates = historicalData.map((item) => item.date)

    // Basic metrics
    const highestPrice = Math.max(...prices)
    const lowestPrice = Math.min(...prices)
    const averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length
    const averageVolume =
      volumes.reduce((sum, volume) => sum + volume, 0) / volumes.length
    const priceChange = prices[prices.length - 1] - prices[0]
    const priceChangePercentage = (priceChange / prices[0]) * 100

    // Technical indicators
    // Moving Averages
    const ma50 = technicalIndicators.SMA.calculate({
      period: 50,
      values: prices,
    })

    const ma200 = technicalIndicators.SMA.calculate({
      period: 200,
      values: prices,
    })

    // RSI
    const rsiValues = technicalIndicators.RSI.calculate({
      period: 14,
      values: prices,
    })

    // MACD
    const macdValues = technicalIndicators.MACD.calculate({
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      values: prices,
    })

    // Bollinger Bands
    const bollingerBands = technicalIndicators.BollingerBands.calculate({
      period: 20,
      values: prices,
      stdDev: 2,
    })

    // Generate recommendation
    let recommendation = 'HOLD'
    const lastPrice = prices[prices.length - 1]
    const lastRSI = rsiValues[rsiValues.length - 1]
    const lastMACD = macdValues[macdValues.length - 1]
    const lastMA50 = ma50[ma50.length - 1] || 0
    const lastMA200 = ma200[ma200.length - 1] || 0

    // Simple recommendation logic
    if (lastRSI < 30 && lastPrice > lastMA200 && lastMACD.histogram > 0) {
      recommendation = 'BUY'
    } else if (lastRSI < 20) {
      recommendation = 'STRONG_BUY'
    } else if (
      lastRSI > 70 &&
      lastPrice < lastMA200 &&
      lastMACD.histogram < 0
    ) {
      recommendation = 'SELL'
    } else if (lastRSI > 80) {
      recommendation = 'STRONG_SELL'
    } else if (lastPrice > lastMA50 && lastMA50 > lastMA200) {
      recommendation = 'BUY'
    } else if (lastPrice < lastMA50 && lastMA50 < lastMA200) {
      recommendation = 'SELL'
    }

    // Create analysis object
    const analysis = {
      period,
      startDate: new Date(dates[0]),
      endDate: new Date(dates[dates.length - 1]),
      highestPrice,
      lowestPrice,
      averagePrice,
      averageVolume,
      priceChange,
      priceChangePercentage,
      movingAverage50: lastMA50,
      movingAverage200: lastMA200,
      rsi: lastRSI,
      macd: lastMACD.MACD,
      bollingerBands: {
        upper: bollingerBands[bollingerBands.length - 1].upper,
        middle: bollingerBands[bollingerBands.length - 1].middle,
        lower: bollingerBands[bollingerBands.length - 1].lower,
      },
      recommendation,
      analysisData: {
        prices,
        dates,
        volumes,
        ma50,
        ma200,
        rsi: rsiValues,
        macd: macdValues,
        bollingerBands,
      },
      StockId: stock.id,
    }

    // Save analysis to database
    const savedAnalysis = await StockAnalysis.create(analysis)

    res.json(savedAnalysis)
  } catch (error) {
    next(error)
  }
}

// Compare stocks
exports.compareStocks = async (req, res, next) => {
  try {
    const { symbols } = req.query

    if (!symbols) {
      return res.status(400).json({ message: 'Symbols parameter is required' })
    }

    const symbolsArray = symbols.split(',')
    if (symbolsArray.length < 2 || symbolsArray.length > 5) {
      return res
        .status(400)
        .json({ message: 'Please provide between 2 and 5 stock symbols' })
    }

    const period = req.query.period || '1y'

    // Get data for each stock
    const stocksData = []

    for (const symbol of symbolsArray) {
      // Get stock
      const stock = await Stock.findOne({ where: { symbol } })
      if (!stock) {
        return res.status(404).json({ message: `Stock ${symbol} not found` })
      }

      // Get historical data
      const response = await axios.get(
        `${process.env.STOCK_API_URL}/stock/${symbol}/chart/${period}`,
        {
          params: {
            token: process.env.STOCK_API_KEY,
          },
        }
      )

      const historicalData = response.data
      const prices = historicalData.map((item) => item.close)
      const dates = historicalData.map((item) => item.date)

      // Calculate metrics
      const priceChange = prices[prices.length - 1] - prices[0]
      const priceChangePercentage = (priceChange / prices[0]) * 100

      // Normalize prices for comparison (starting at 100)
      const normalizedPrices = prices.map((price) => (price / prices[0]) * 100)

      stocksData.push({
        symbol,
        name: stock.companyName,
        currentPrice: stock.currentPrice,
        priceChange,
        priceChangePercentage,
        normalizedPrices,
        dates,
      })
    }

    res.json({
      period,
      stocks: stocksData,
    })
  } catch (error) {
    next(error)
  }
}

// Get sector performance
exports.getSectorPerformance = async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.STOCK_API_URL}/stock/market/sector-performance`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    next(error)
  }
}
