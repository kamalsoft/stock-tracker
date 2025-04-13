const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Portfolio = sequelize.define('Portfolio', {
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
    initialInvestment: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    currentValue: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    cashBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  })

  return Portfolio
}
