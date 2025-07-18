import { configureStore } from '@reduxjs/toolkit'
import pasteReducer, { authReducer } from './redux/pasteSlice'

export const store = configureStore({
  reducer: {
    paste: pasteReducer,
    auth: authReducer,
  },
})