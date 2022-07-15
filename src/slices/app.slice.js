/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checked: false,
  loggedIn: false,
  me: {},
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    authenticate: (state, { payload }) => {
      state.loggedIn = payload.loggedIn
      state.checked = payload.checked
    },
    saveMe: (state, { payload }) => {
      state.me = payload.me
    },
  },
})

export const { action } = appSlice
export const { authenticate, saveMe } = appSlice.actions

export default appSlice.reducer
