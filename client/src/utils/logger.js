/**
 * Simple logger utility for the application
 */
const logger = {
  /**
   * Log a message to the console
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  log: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.log(`[INFO] ${message}`, data)
      } else {
        console.log(`[INFO] ${message}`)
      }
    }
  },

  /**
   * Log an error to the console
   * @param {string} message - The error message
   * @param {Error|any} error - The error object or data
   */
  error: (message, error) => {
    if (error) {
      console.error(`[ERROR] ${message}`, error)
    } else {
      console.error(`[ERROR] ${message}`)
    }

    // In a real app, you might want to send errors to a monitoring service
  },

  /**
   * Log a warning to the console
   * @param {string} message - The warning message
   * @param {any} data - Optional data to log
   */
  warn: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.warn(`[WARN] ${message}`, data)
      } else {
        console.warn(`[WARN] ${message}`)
      }
    }
  },

  /**
   * Start a timer for performance measurement
   * @param {string} label - The timer label
   */
  time: (label) => {
    if (process.env.NODE_ENV !== 'production') {
      console.time(`[TIMER] ${label}`)
    }
  },

  /**
   * End a timer and log the elapsed time
   * @param {string} label - The timer label
   */
  timeEnd: (label) => {
    if (process.env.NODE_ENV !== 'production') {
      console.timeEnd(`[TIMER] ${label}`)
    }
  },

  /**
   * Log a debug message to the console
   * @param {string} message - The debug message
   * @param {any} data - Optional data to log
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      if (data) {
        console.debug(`[DEBUG] ${message}`, data)
      } else {
        console.debug(`[DEBUG] ${message}`)
      }
    }
  },
}

export default logger
