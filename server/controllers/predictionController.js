const { Stock } = require('../db/models')
const axios = require('axios')
const technicalIndicators = require('technicalindicators')

// Get stock prediction
exports.getStockPrediction = async (req, res, next) => {
  try {
    const { symbol } = req.params

    // Get stock
    const stock = await Stock.findOne({ where: { symbol } })
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    // Get historical data
    const response = await axios.get(
      `${process.env.STOCK_API_URL}/stock/${symbol}/chart/1y`,
      {
        params: {
          token: process.env.STOCK_API_KEY,
        },
      }
    )

    const historicalData = response.data
    const prices = historicalData.map((item) => item.close)
    const dates = historicalData.map((item) => item.date)

    // Calculate technical indicators
    const sma = technicalIndicators.SMA.calculate({
      period: 20,
      values: prices,
    })

    const ema = technicalIndicators.EMA.calculate({
      period: 20,
      values: prices,
    })

    const rsi = technicalIndicators.RSI.calculate({
      period: 14,
      values: prices,
    })

    const macd = technicalIndicators.MACD.calculate({
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      values: prices,
    })

    // Simple linear regression for price prediction
    // This is a very basic prediction model for demonstration
    const days = Array.from({ length: prices.length }, (_, i) => i)

    // Calculate slope and intercept
    const n = prices.length
    const sumX = days.reduce((a, b) => a + b, 0)
    const sumY = prices.reduce((a, b) => a + b, 0)
    const sumXY = days.reduce((sum, day, i) => sum + day * prices[i], 0)
    const sumXX = days.reduce((sum, day) => sum + day * day, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Predict next 30 days
    const futureDays = Array.from({ length: 30 }, (_, i) => prices.length + i)
    const predictedPrices = futureDays.map((day) => slope * day + intercept)

    // Generate future dates
    const lastDate = new Date(dates[dates.length - 1])
    const futureDates = futureDays.map((day) => {
      const date = new Date(lastDate)
      date.setDate(date.getDate() + (day - prices.length + 1))
      return date.toISOString().split('T')[0]
    })

    // Calculate confidence intervals (simple approach)
    const residuals = prices.map(
      (price, i) => price - (slope * days[i] + intercept)
    )
    const residualStdDev = Math.sqrt(
      residuals.reduce((sum, res) => sum + res * res, 0) / (n - 2)
    )

    const confidenceIntervals = predictedPrices.map((price, i) => {
      const day = futureDays[i]
      const standardError =
        residualStdDev *
        Math.sqrt(1 + 1 / n + (day - sumX / n) ** 2 / (sumXX - sumX ** 2 / n))
      const margin = 1.96 * standardError // 95% confidence interval
      return {
        upper: price + margin,
        lower: price - margin,
      }
    })

    // Determine prediction trend
    const lastPrice = prices[prices.length - 1]
    const predictedPrice = predictedPrices[predictedPrices.length - 1]
    const trend =
      predictedPrice > lastPrice
        ? 'UP'
        : predictedPrice < lastPrice
        ? 'DOWN'
        : 'NEUTRAL'

    // Calculate expected return and risk
    const expectedReturn = ((predictedPrice - lastPrice) / lastPrice) * 100
    const priceChanges = prices
      .slice(1)
      .map((price, i) => ((price - prices[i]) / prices[i]) * 100)
    const volatility = Math.sqrt(
      priceChanges.reduce((sum, change) => sum + change * change, 0) /
        priceChanges.length
    )

    res.json({
      symbol,
      companyName: stock.companyName,
      currentPrice: lastPrice,
      prediction: {
        dates: futureDates,
        prices: predictedPrices,
        confidenceIntervals,
        trend,
        expectedReturn,
        volatility,
        lastUpdated: new Date(),
      },
      technicalIndicators: {
        sma: sma[sma.length - 1],
        ema: ema[ema.length - 1],
        rsi: rsi[rsi.length - 1],
        macd: macd[macd.length - 1],
      },
    })
  } catch (error) {
    next(error)
  }
}
