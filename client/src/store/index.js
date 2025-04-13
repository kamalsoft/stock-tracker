import { configureStore } from '@reduxjs/toolkit'
import logger from '../utils/logger'
import authReducer from './slices/authSlice'
import portfolioReducer from './slices/portfolioSlice'

// Custom middleware to log actions and state changes
const loggerMiddleware = (store) => (next) => (action) => {
  logger.log('Dispatching action:', action.type)
  logger.time(`Redux action: ${action.type}`)
  const result = next(action)
  logger.timeEnd(`Redux action: ${action.type}`)
  return result
}

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(process.env.NODE_ENV === 'development' ? loggerMiddleware : []),
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
