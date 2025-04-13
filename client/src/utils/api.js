import axios from 'axios'
import logger from './logger'

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Log request
    logger.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    })

    // Start timer for this request
    const requestId = `${config.method}-${config.url}-${Date.now()}`
    config.requestId = requestId
    logger.time(`API Request: ${requestId}`)

    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // End timer for this request
    const { config } = response
    if (config.requestId) {
      logger.timeEnd(`API Request: ${config.requestId}`)
    }

    // Log response
    logger.log(`API Response: ${config.method.toUpperCase()} ${config.url}`, {
      status: response.status,
      data: response.data,
    })

    return response
  },
  (error) => {
    // End timer for this request
    const { config } = error
    if (config && config.requestId) {
      logger.timeEnd(`API Request: ${config.requestId}`)
    }

    // Log error details
    logger.error('API Response Error:', {
      url: config?.url,
      method: config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })

    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status } = error.response

      // Handle authentication errors
      if (status === 401) {
        logger.warn('Authentication error - redirecting to login')
        // You could dispatch a logout action here or redirect
      }

      // Handle server errors
      if (status >= 500) {
        logger.error('Server error', error.response.data)
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      logger.error('Network error - no response received', error.request)
    } else {
      // Something else happened while setting up the request
      logger.error('Request setup error', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
