const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Stock = sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
    },
    industry: {
      type: DataTypes.STRING,
    },
    currentPrice: {
      type: DataTypes.FLOAT,
    },
    previousClose: {
      type: DataTypes.FLOAT,
    },
    open: {
      type: DataTypes.FLOAT,
    },
    dayHigh: {
      type: DataTypes.FLOAT,
    },
    dayLow: {
      type: DataTypes.FLOAT,
    },
    volume: {
      type: DataTypes.BIGINT,
    },
    marketCap: {
      type: DataTypes.BIGINT,
    },
    peRatio: {
      type: DataTypes.FLOAT,
    },
    dividend: {
      type: DataTypes.FLOAT,
    },
    dividendYield: {
      type: DataTypes.FLOAT,
    },
    eps: {
      type: DataTypes.FLOAT,
    },
    beta: {
      type: DataTypes.FLOAT,
    },
    fiftyTwoWeekHigh: {
      type: DataTypes.FLOAT,
    },
    fiftyTwoWeekLow: {
      type: DataTypes.FLOAT,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  })

  return Stock
}
