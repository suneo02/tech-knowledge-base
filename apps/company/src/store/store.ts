import { createStore } from 'redux'
import rootReducers from '../reducers'

export type RootState = ReturnType<typeof rootReducers>

const store = createStore<RootState, any, any, any>(rootReducers)

export default store
