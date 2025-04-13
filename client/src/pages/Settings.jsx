import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material'
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material'
import logger from '../utils/logger'

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    priceAlerts: true,
    newsAlerts: false,
    portfolioUpdates: true,
    marketSummaries: true,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    currency: 'USD',
    language: 'en',
  })

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setSuccessMessage('')
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfileSettings({
      ...profileSettings,
      [name]: value,
    })
  }

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  const handleSecurityChange = (event) => {
    const { name, value, checked } = event.target
    setSecuritySettings({
      ...securitySettings,
      [name]: name === 'twoFactorAuth' ? checked : value,
    })
  }

  const handleAppearanceChange = (event) => {
    const { name, value } = event.target
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    })
  }

  const handleSaveSettings = () => {
    // In a real app, you would send this to your API
    logger.log('Saving settings', {
      activeTab,
      profileSettings,
      notificationSettings,
      securitySettings,
      appearanceSettings,
    })

    setSuccessMessage('Settings saved successfully!')

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  const renderProfileSettings = () => {
    return (
      <Box>
        <Typography variant='h6' gutterBottom>
          Profile Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              name='firstName'
              value={profileSettings.firstName}
              onChange={handleProfileChange}
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              name='lastName'
              value={profileSettings.lastName}
              onChange={handleProfileChange}
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Email'
              name='email'
              type='email'
              value={profileSettings.email}
              onChange={handleProfileChange}
              margin='normal'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Phone'
              name='phone'
              value={profileSettings.phone}
              onChange={handleProfileChange}
              margin='normal'
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </Box>
      </Box>
    )
  }

  const renderNotificationSettings = () => {
    return (
      <Box>
        <Typography variant='h6' gutterBottom>
          Notification Settings
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.emailAlerts}
                onChange={handleNotificationChange}
                name='emailAlerts'
                color='primary'
              />
            }
            label='Email Alerts'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Receive important alerts via email
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.priceAlerts}
                onChange={handleNotificationChange}
                name='priceAlerts'
                color='primary'
              />
            }
            label='Price Alerts'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Get notified when stocks reach your target prices
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.newsAlerts}
                onChange={handleNotificationChange}
                name='newsAlerts'
                color='primary'
              />
            }
            label='News Alerts'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Receive news updates about stocks in your portfolios and watchlists
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.portfolioUpdates}
                onChange={handleNotificationChange}
                name='portfolioUpdates'
                color='primary'
              />
            }
            label='Portfolio Updates'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Get daily summaries of your portfolio performance
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.marketSummaries}
                onChange={handleNotificationChange}
                name='marketSummaries'
                color='primary'
              />
            }
            label='Market Summaries'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Receive daily market summaries and insights
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </Box>
      </Box>
    )
  }

  const renderSecuritySettings = () => {
    return (
      <Box>
        <Typography variant='h6' gutterBottom>
          Security Settings
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={securitySettings.twoFactorAuth}
                onChange={handleSecurityChange}
                name='twoFactorAuth'
                color='primary'
              />
            }
            label='Two-Factor Authentication'
          />
          <Typography variant='body2' color='text.secondary' sx={{ ml: 4 }}>
            Add an extra layer of security to your account
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            Session Timeout
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Timeout Period</InputLabel>
            <Select
              value={securitySettings.sessionTimeout}
              label='Timeout Period'
              name='sessionTimeout'
              onChange={handleSecurityChange}
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
              <MenuItem value={240}>4 hours</MenuItem>
            </Select>
          </FormControl>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            Automatically log out after a period of inactivity
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            Change Password
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Current Password'
                type='password'
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='New Password'
                type='password'
                margin='normal'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Confirm New Password'
                type='password'
                margin='normal'
              />
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </Box>
      </Box>
    )
  }

  const renderAppearanceSettings = () => {
    return (
      <Box>
        <Typography variant='h6' gutterBottom>
          Appearance Settings
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            Theme
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Theme</InputLabel>
            <Select
              value={appearanceSettings.theme}
              label='Theme'
              name='theme'
              onChange={handleAppearanceChange}
            >
              <MenuItem value='light'>Light</MenuItem>
              <MenuItem value='dark'>Dark</MenuItem>
              <MenuItem value='system'>System Default</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            Currency
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={appearanceSettings.currency}
              label='Currency'
              name='currency'
              onChange={handleAppearanceChange}
            >
              <MenuItem value='USD'>US Dollar (USD)</MenuItem>
              <MenuItem value='EUR'>Euro (EUR)</MenuItem>
              <MenuItem value='GBP'>British Pound (GBP)</MenuItem>
              <MenuItem value='JPY'>Japanese Yen (JPY)</MenuItem>
              <MenuItem value='CAD'>Canadian Dollar (CAD)</MenuItem>
              <MenuItem value='AUD'>Australian Dollar (AUD)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle1' gutterBottom>
            Language
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={appearanceSettings.language}
              label='Language'
              name='language'
              onChange={handleAppearanceChange}
            >
              <MenuItem value='en'>English</MenuItem>
              <MenuItem value='es'>Spanish</MenuItem>
              <MenuItem value='fr'>French</MenuItem>
              <MenuItem value='de'>German</MenuItem>
              <MenuItem value='zh'>Chinese</MenuItem>
              <MenuItem value='ja'>Japanese</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={handleSaveSettings}>
            Save Changes
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4' component='h1' gutterBottom>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity='success' sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab icon={<PersonIcon />} label='Profile' />
          <Tab icon={<NotificationsIcon />} label='Notifications' />
          <Tab icon={<SecurityIcon />} label='Security' />
          <Tab icon={<PaletteIcon />} label='Appearance' />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {activeTab === 0 && renderProfileSettings()}
        {activeTab === 1 && renderNotificationSettings()}
        {activeTab === 2 && renderSecuritySettings()}
        {activeTab === 3 && renderAppearanceSettings()}
      </Paper>
    </Container>
  )
}

export default Settings
