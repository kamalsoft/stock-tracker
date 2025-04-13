const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const WatchList = sequelize.define('WatchList', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  })

  return WatchList
}
