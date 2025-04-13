const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const StockAnalysis = sequelize.define('StockAnalysis', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    highestPrice: {
      type: DataTypes.FLOAT,
    },
    lowestPrice: {
      type: DataTypes.FLOAT,
    },
    averagePrice: {
      type: DataTypes.FLOAT,
    },
    averageVolume: {
      type: DataTypes.BIGINT,
    },
    priceChange: {
      type: DataTypes.FLOAT,
    },
    priceChangePercentage: {
      type: DataTypes.FLOAT,
    },
    movingAverage50: {
      type: DataTypes.FLOAT,
    },
    movingAverage200: {
      type: DataTypes.FLOAT,
    },
    rsi: {
      type: DataTypes.FLOAT,
    },
    macd: {
      type: DataTypes.FLOAT,
    },
    bollingerBands: {
      type: DataTypes.JSON,
    },
    recommendation: {
      type: DataTypes.ENUM('STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'),
    },
    analysisData: {
      type: DataTypes.JSON,
    },
  })

  return StockAnalysis
}
