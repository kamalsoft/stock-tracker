import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import logger from '../../utils/logger'

const LoadingScreen = () => {
  const [loadingTime, setLoadingTime] = useState(0)
  const [showSlowLoadingMessage, setShowSlowLoadingMessage] = useState(false)

  useEffect(() => {
    logger.log('LoadingScreen mounted')
    const startTime = Date.now()

    // Update loading time every second
    const interval = setInterval(() => {
      const currentLoadingTime = Math.floor((Date.now() - startTime) / 1000)
      setLoadingTime(currentLoadingTime)

      // Show slow loading message after 3 seconds
      if (currentLoadingTime >= 3 && !showSlowLoadingMessage) {
        setShowSlowLoadingMessage(true)
        logger.warn(
          `Loading is taking longer than expected: ${currentLoadingTime}s`
        )
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      const totalLoadingTime = Math.floor((Date.now() - startTime) / 1000)
      logger.log(`LoadingScreen unmounted after ${totalLoadingTime}s`)
    }
  }, [showSlowLoadingMessage])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant='h6' sx={{ mt: 2 }}>
        Loading...
      </Typography>

      {showSlowLoadingMessage && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
          This is taking longer than expected ({loadingTime}s).
          <br />
          Please check the console for any errors.
        </Typography>
      )}
    </Box>
  )
}

export default LoadingScreen
