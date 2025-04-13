import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Dashboard from './pages/Dashboard'
import Portfolios from './pages/Portfolios'
import PortfolioDetail from './pages/PortfolioDetail'
import Watchlists from './pages/Watchlists'
import WatchlistDetail from './pages/WatchlistDetail'
import Stocks from './pages/Stocks'
import StockDetail from './pages/StockDetail'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import { Container, Box } from '@mui/material'

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth='lg'>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/portfolios' element={<Portfolios />} />
              <Route path='/portfolios/:id' element={<PortfolioDetail />} />
              <Route path='/watchlists' element={<Watchlists />} />
              <Route path='/watchlists/:id' element={<WatchlistDetail />} />
              <Route path='/stocks' element={<Stocks />} />
              <Route path='/stocks/:symbol' element={<StockDetail />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
