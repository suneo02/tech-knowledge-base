import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import translationReducer from './translation'
import { AppDispatch, RootState } from './type'
import userPackageReducer from './user'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = configureStore({
  reducer: {
    userPackage: userPackageReducer,
    translation: translationReducer,
  },
})

// Re-export user package actions and selectors
export { selectIsTranslating } from './translation'
export { fetchPackageInfo, selectUserPackage, selectUserPackageError, selectUserPackageLoading } from './user'
