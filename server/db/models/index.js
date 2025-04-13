const { Sequelize } = require('sequelize')
const path = require('path')

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../data/stock_tracker.sqlite'),
  logging: false,
})

// Import models
const User = require('./user')(sequelize)
const Stock = require('./stock')(sequelize)
const Portfolio = require('./portfolio')(sequelize)
const Transaction = require('./transaction')(sequelize)
const WatchList = require('./watchlist')(sequelize)
const StockAnalysis = require('./stockAnalysis')(sequelize)
const UserPreference = require('./userPreference')(sequelize)

// Define associations
User.hasOne(UserPreference)
UserPreference.belongsTo(User)

User.hasMany(Portfolio)
Portfolio.belongsTo(User)

User.hasMany(WatchList)
WatchList.belongsTo(User)

Portfolio.hasMany(Transaction)
Transaction.belongsTo(Portfolio)

WatchList.belongsToMany(Stock, { through: 'WatchListStocks' })
Stock.belongsToMany(WatchList, { through: 'WatchListStocks' })

Stock.hasMany(StockAnalysis)
StockAnalysis.belongsTo(Stock)

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Stock,
  Portfolio,
  Transaction,
  WatchList,
  StockAnalysis,
  UserPreference,
}
