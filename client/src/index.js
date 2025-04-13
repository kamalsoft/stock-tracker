import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import logger from './utils/logger'
import './index.css'

// Log initial load time
logger.time('Initial Render')

// Add error boundary for the entire app
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught an error', { error, errorInfo })
  }

  /**
   * If an error occurs in any component inside this ErrorBoundary,
   * this component will be shown in its place.
   * The error message will be logged to the console and the user will be given
   * a button to reload the page.
   * @returns {React.ReactElement} fallback UI if an error occurs
   */
  render() {
    // Fallback UI for error boundary
    // This will be shown if any component inside the ErrorBoundary throws an error
    if (this.state.hasError) {
      return (
        // You can render any custom fallback UI
        <div
          style={{
            padding: '20px',
            margin: '20px',
            border: '1px solid #f44336',
            borderRadius: '4px',
            backgroundColor: '#ffebee',
          }}
        >
          <h1>Something went wrong</h1>
          <p>We're sorry, but there was an error loading the application.</p>
          <p>Error: {this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    logger.timeEnd('Initial Render')

    // Log if the page is taking too long to become interactive
    setTimeout(() => {
      const firstInputDelay = performance.now()
      if (firstInputDelay > 100) {
        logger.warn(
          `Page took ${Math.round(firstInputDelay)}ms to become interactive`
        )
      }
    }, 0)
  }
)

// Report Web Vitals
const reportWebVitals = (metric) => {
  const { name, value } = metric

  // Log Core Web Vitals
  if (name === 'FCP') {
    logger.log(`First Contentful Paint: ${Math.round(value)}ms`)
  } else if (name === 'LCP') {
    logger.log(`Largest Contentful Paint: ${Math.round(value)}ms`)
    if (value > 2500) {
      logger.warn(`Slow LCP: ${Math.round(value)}ms (should be < 2500ms)`)
    }
  } else if (name === 'CLS') {
    logger.log(`Cumulative Layout Shift: ${value.toFixed(3)}`)
    if (value > 0.1) {
      logger.warn(`High CLS: ${value.toFixed(3)} (should be < 0.1)`)
    }
  } else if (name === 'FID') {
    logger.log(`First Input Delay: ${Math.round(value)}ms`)
    if (value > 100) {
      logger.warn(`Slow FID: ${Math.round(value)}ms (should be < 100ms)`)
    }
  } else if (name === 'TTFB') {
    logger.log(`Time to First Byte: ${Math.round(value)}ms`)
    if (value > 600) {
      logger.warn(`Slow TTFB: ${Math.round(value)}ms (should be < 600ms)`)
    }
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(reportWebVitals)
