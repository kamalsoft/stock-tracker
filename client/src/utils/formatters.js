/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (e.g., 'USD')
 * @param {string} locale - The locale (defaults to 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

/**
 * Format a number as a percentage
 * @param {number} value - The value to format (e.g., 0.1234 for 12.34%)
 * @param {number} digits - Number of digits after decimal point
 * @param {string} locale - The locale (defaults to 'en-US')
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, digits = 2, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

/**
 * Format a date string
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale (defaults to 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}, locale = 'en-US') => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }

  return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date))
}

/**
 * Format a large number with abbreviations (K, M, B, T)
 * @param {number} value - The value to format
 * @param {number} digits - Number of digits after decimal point
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value, digits = 1) => {
  if (value === null || value === undefined) return '-'

  const absValue = Math.abs(value)

  if (absValue >= 1000000000000) {
    return (value / 1000000000000).toFixed(digits) + 'T'
  }
  if (absValue >= 1000000000) {
    return (value / 1000000000).toFixed(digits) + 'B'
  }
  if (absValue >= 1000000) {
    return (value / 1000000).toFixed(digits) + 'M'
  }
  if (absValue >= 1000) {
    return (value / 1000).toFixed(digits) + 'K'
  }

  return value.toString()
}
