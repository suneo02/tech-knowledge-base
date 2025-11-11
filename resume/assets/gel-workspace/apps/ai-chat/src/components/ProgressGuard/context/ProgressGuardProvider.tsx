import React, { useState, ReactNode } from 'react'
import { ProgressContext } from './ProgressContext'
import { ProgressContextType } from '../types'

export const ProgressGuardProvider = ({ children }: { children: ReactNode }) => {
  const [inProgress, setInProgress] = useState(false)

  const startProgress = () => setInProgress(true)
  const endProgress = () => setInProgress(false)

  const value: ProgressContextType = { inProgress, startProgress, endProgress }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
