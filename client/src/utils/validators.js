/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

/**
 * Validate a password (min 8 chars, at least one letter and one number)
 * @param {string} password - The password to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidPassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return re.test(String(password))
}

/**
 * Validate a stock symbol
 * @param {string} symbol - The stock symbol to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidStockSymbol = (symbol) => {
  const re = /^[A-Z]{1,5}$/
  return re.test(String(symbol).toUpperCase())
}

/**
 * Validate a number is positive
 * @param {number} value - The value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isPositiveNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value > 0
}

/**
 * Validate a number is non-negative (zero or positive)
 * @param {number} value - The value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isNonNegativeNumber = (value) => {
  return typeof value === 'number' && !isNaN(value) && value >= 0
}
