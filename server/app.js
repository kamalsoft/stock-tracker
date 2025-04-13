const express = require('express')
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/auth')
const stockRoutes = require('./routes/stocks')
const portfolioRoutes = require('./routes/portfolio')
const analysisRoutes = require('./routes/analysis')
const predictionRoutes = require('./routes/predictions')
const { errorHandler } = require('./middleware/errorHandler')
const { authMiddleware } = require('./middleware/auth')

const app = express()
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/portfolio', authMiddleware, portfolioRoutes)
app.use('/api/analysis', authMiddleware, analysisRoutes)
app.use('/api/predictions', authMiddleware, predictionRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
  })
}

// Error handling middleware
app.use(errorHandler)

module.exports = app
