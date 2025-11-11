import { createContext } from 'react'
import type { ProgressContextType } from '../types'

export const ProgressContext = createContext<ProgressContextType | null>(null)
