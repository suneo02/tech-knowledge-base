import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { type AppDispatch, type RootState } from './type'

import userReducer from './user'
import superAgentReducer from './superAgent'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = configureStore({
  reducer: {
    user: userReducer,
    superAgentReducer,
  },
})

// Re-export user actions and selectors
export * from './user'
export * from './superAgent'
