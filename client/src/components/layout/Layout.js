import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Work as PortfoliosIcon,
  Bookmark as WatchlistsIcon,
  ShowChart as StocksIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material'
import logger from '../utils/logger'

// Drawer width
const drawerWidth = 240

const Layout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State for drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)

  // State for user menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const userMenuOpen = Boolean(userMenuAnchorEl)

  // State for notifications menu
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null)
  const notificationsMenuOpen = Boolean(notificationsAnchorEl)

  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Portfolios', icon: <PortfoliosIcon />, path: '/portfolios' },
    { text: 'Watchlists', icon: <WatchlistsIcon />, path: '/watchlists' },
    { text: 'Stocks', icon: <StocksIcon />, path: '/stocks' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ]

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const handleLogout = () => {
    logger.log('User logged out')
    handleUserMenuClose()
    // In a real app, you would handle logout logic here
  }

  // Determine if a nav item is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true
    }
    return location.pathname.startsWith(path) && path !== '/'
  }

  // Drawer content
  const drawer = (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Typography variant='h6' component='div'>
          Stock Tracker
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 'bold' : 'regular',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position='fixed'
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          width: { md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            {navItems.find((item) => isActive(item.path))?.text ||
              'Stock Tracker'}
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <IconButton color='inherit' onClick={() => navigate('/search')}>
              <SearchIcon />
            </IconButton>

            <Tooltip title='Notifications'>
              <IconButton color='inherit' onClick={handleNotificationsOpen}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Account'>
              <IconButton onClick={handleUserMenuOpen} color='inherit'>
                <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Spacer to push content below app bar */}
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
          ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer to push content below app bar */}
        <Container maxWidth='xl' sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            navigate('/profile')
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleUserMenuClose()
            navigate('/settings')
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={notificationsMenuOpen}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Typography variant='subtitle1' fontWeight='bold'>
            Notifications
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant='body2' fontWeight='bold'>
              AAPL price alert
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Apple Inc. has reached your target price of $180.00
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              2 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Box sx={{ py: 1 }}>
            <Typography variant='body2' fontWeight='bold'>
              Portfolio update
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Your Growth Portfolio is up 2.5% today
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              5 hours ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant='body2' color='primary' align='center'>
            See all notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Layout
