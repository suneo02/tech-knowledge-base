import { RootAction } from '@/reducers/redux.types'
import { useSelector } from 'react-redux'
import { createStore } from 'redux'
import rootReducers from '../reducers'

export type RootState = ReturnType<typeof rootReducers>

const store = createStore<RootState, RootAction, {}, {}>(rootReducers)

export default store

export function useAppSelector<TSelected = unknown>(selector: (state: RootState) => TSelected): TSelected {
  return useSelector<RootState, TSelected>(selector)
}
