require('dotenv').config()
const app = require('./app')
const { sequelize } = require('./db/models')

const PORT = process.env.PORT || 5000

/**
 * Initializes the server by syncing the database models and starting the server on a specified port.
 */
async function initializeServer() {
  console.clear()
  try {
    await sequelize.sync()
    await sequelize.authenticate()
    console.log('Database successfully synchronized')

    app.listen(PORT, () => {
      console.log(`Server is operational on port ${PORT}`)
    })
  } catch (err) {
    console.error('Server initialization failed:', err)
    process.exit(1)
  }
}

initializeServer()
