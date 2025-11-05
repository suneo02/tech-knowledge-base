import { AppDispatch, RootState } from './type'
import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import cdeReducer from './CDE'
import indicatorReducer from './incicator'
import pointsReducer from './points'
import userPackageReducer from './user'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = configureStore({
  reducer: {
    userPackage: userPackageReducer,
    cde: cdeReducer,
    indicator: indicatorReducer,
    points: pointsReducer,
  },
})

// Re-export user package actions and selectors
export { fetchPackageInfo, selectUserPackage, selectUserPackageError, selectUserPackageLoading } from './user'

export {
  fetchFilterCategories,
  selectFilterCategories,
  selectFilterCategoriesError,
  selectFilterCategoriesLoading,
  selectHasLoaded,
} from './CDE'

// Re-export points actions and selectors
export { consumePoints, selectPointsCount, selectPointsLoading, selectPointsError, fetchPoints } from './points'
