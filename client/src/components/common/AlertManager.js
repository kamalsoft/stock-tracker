import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'
import { removeAlert } from '../../store/slices/alertSlice'

const AlertManager = () => {
  const dispatch = useDispatch()
  const { alerts } = useSelector((state) => state.alert)

  useEffect(() => {
    // Set up automatic removal of alerts based on their timeout
    alerts.forEach((alert) => {
      if (alert.timeout) {
        const timer = setTimeout(() => {
          dispatch(removeAlert(alert.id))
        }, alert.timeout)

        return () => clearTimeout(timer)
      }
    })
  }, [alerts, dispatch])

  const handleClose = (id) => {
    dispatch(removeAlert(id))
  }

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => handleClose(alert.id)}
          autoHideDuration={alert.timeout || 5000}
        >
          <Alert
            onClose={() => handleClose(alert.id)}
            severity={alert.type}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}

export default AlertManager
