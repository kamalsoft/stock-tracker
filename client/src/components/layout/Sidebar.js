import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import StarIcon from '@mui/icons-material/Star'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpIcon from '@mui/icons-material/Help'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const Sidebar = ({ open, drawerWidth, handleDrawerClose }) => {
  const location = useLocation()
  const { portfolios } = useSelector((state) => state.portfolio)

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Stocks', icon: <ShowChartIcon />, path: '/stocks' },
    { text: 'Watchlists', icon: <StarIcon />, path: '/watchlists' },
    { text: 'Transactions', icon: <HistoryIcon />, path: '/transactions' },
  ]

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant='persistent'
      anchor='left'
      open={open}
    >
      <DrawerHeader>
        <Typography variant='h6' sx={{ flexGrow: 1, ml: 2 }}>
          StockTracker
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant='subtitle2' color='text.secondary'>
          MY PORTFOLIOS
        </Typography>
      </Box>

      <List>
        {portfolios &&
          portfolios.map((portfolio) => (
            <ListItem key={portfolio.id} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={`/portfolio/${portfolio.id}`}
                selected={location.pathname === `/portfolio/${portfolio.id}`}
              >
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary={portfolio.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to='/settings'>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to='/help'>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary='Help & Support' />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}

export default Sidebar
