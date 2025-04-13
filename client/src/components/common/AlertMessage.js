import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { clearAlert } from '../../store/slices/alertSlice'

const AlertMessage = () => {
  const dispatch = useDispatch()
  const { message, type, open } = useSelector((state) => state.alert)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(clearAlert())
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AlertMessage
