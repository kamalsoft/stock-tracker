import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { getCurrentUser } from './store/slices/authSlice'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import PortfolioDetail from './pages/PortfolioDetail'
import Market from './pages/Market'
import Watchlists from './pages/Watchlists'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'

// Theme
import theme from './theme'

// Utils
import logger from './utils/logger'

const App = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      logger.log('Token found, fetching current user')
      dispatch(getCurrentUser())
    }
  }, [dispatch])

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      // You could return a loading spinner here
      return <div>Loading...</div>
    }

    if (!isAuthenticated) {
      logger.log('User not authenticated, redirecting to login')
      return <Navigate to='/login' />
    }

    return children
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* App routes with layout */}
          <Route path='/' element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='portfolios/:id'
              element={
                <ProtectedRoute>
                  <PortfolioDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path='market'
              element={
                <ProtectedRoute>
                  <Market />
                </ProtectedRoute>
              }
            />

            <Route
              path='watchlists'
              element={
                <ProtectedRoute>
                  <Watchlists />
                </ProtectedRoute>
              }
            />

            <Route
              path='settings'
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
