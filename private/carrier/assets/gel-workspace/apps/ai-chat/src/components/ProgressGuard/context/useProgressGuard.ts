import { useContext } from 'react'
import { ProgressContext } from './ProgressContext'

export const useProgressGuard = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgressGuard must be used within a ProgressGuardProvider')
  }
  return context
}
