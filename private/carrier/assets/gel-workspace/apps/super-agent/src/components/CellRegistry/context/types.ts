import { createContext } from 'react'
import { globalRegistry } from '../core/registry'

interface CellRegistryContextType {
  registry: typeof globalRegistry
}

export const CellRegistryContext = createContext<CellRegistryContextType | undefined>(undefined)
