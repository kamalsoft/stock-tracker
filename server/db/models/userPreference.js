const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('UserPreference', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'light',
    },
    defaultPortfolioId: {
      type: DataTypes.INTEGER,
    },
    defaultWatchlistId: {
      type: DataTypes.INTEGER,
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    priceAlerts: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    newsAlerts: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    dashboardLayout: {
      type: DataTypes.JSON,
      defaultValue: JSON.stringify({
        widgets: ['portfolio', 'watchlist', 'market-overview', 'news'],
      }),
    },
    customSettings: {
      type: DataTypes.JSON,
      defaultValue: JSON.stringify({}),
    },
    refreshInterval: {
      type: DataTypes.INTEGER,
      defaultValue: 60, // seconds
    },
  })

  return UserPreference
}
