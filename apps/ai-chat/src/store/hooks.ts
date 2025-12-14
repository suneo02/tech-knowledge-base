import { useDispatch } from 'react-redux'
import type { AppDispatch } from './type'

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>()
