import { useContext } from 'react'
import { CellRegistryContext } from '../context/types'

export const useCellRegistry = () => {
  const ctx = useContext(CellRegistryContext)
  if (!ctx) throw new Error('useCellRegistry must be used within a CellRegistryProvider')
  return ctx.registry
}
