import { CDEFilterCategory, CDEFilterItem } from 'gel-api'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getCodeMapByBackend } from './getCodeMap'
import { findFilterItemById } from './handle'

export interface CDEFilterCfgContextType {
  filterCfg: CDEFilterCategory[]
  setFilterCfg: (filterConfigList: CDEFilterCategory[]) => void
  codeMap: Record<string, string>
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined
}

const FilterCfgContext = createContext<CDEFilterCfgContextType | null>(null)

export const CDEFilterCfgProvider: React.FC<{
  children: React.ReactNode
  filterCfgDefault?: CDEFilterCategory[]
}> = ({ children, filterCfgDefault }) => {
  const [filterCfg, setFilterCfg] = useState<CDEFilterCategory[]>(filterCfgDefault ?? [])

  const codeMap = useMemo(() => {
    if (filterCfg.length === 0) return {}
    return getCodeMapByBackend(filterCfg)
  }, [filterCfg])

  const getFilterItemById = useCallback<CDEFilterCfgContextType['getFilterItemById']>(
    (itemId) => findFilterItemById(filterCfg, itemId),
    [filterCfg]
  )

  return (
    <FilterCfgContext.Provider
      value={{
        filterCfg,
        setFilterCfg,
        codeMap,
        getFilterItemById,
      }}
    >
      {children}
    </FilterCfgContext.Provider>
  )
}

export const useCDEFilterCfgCtx = () => {
  const context = useContext(FilterCfgContext)
  if (!context) {
    throw new Error('useCDEFilterCfgCtx must be used within a CDEFilterCfgProvider')
  }
  return context
}
