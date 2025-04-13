import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  alerts: [],
}

let nextId = 1

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      const { message, type = 'info', timeout = 5000 } = action.payload
      const id = nextId++

      state.alerts.push({
        id,
        message,
        type,
        timeout,
      })
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload)
    },
  },
})

export const { setAlert, removeAlert } = alertSlice.actions

export default alertSlice.reducer
