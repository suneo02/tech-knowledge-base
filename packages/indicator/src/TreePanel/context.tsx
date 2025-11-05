import type { IndicatorTreeClassification } from 'gel-api'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { filterIndicatorTree, findIndicatorName } from './handle'
import { useIndicatorCheck, type UseIndicatorCheckResult } from './hooks/useIndicatorCheck'

export interface IndicatorTreeContextType extends UseIndicatorCheckResult {
  // 数据源
  data: IndicatorTreeClassification[]
  // 左侧 menu 选中的一级分类
  selectedFirstLevel: string
  setSelectedFirstLevel: (key: string) => void
  // 获取当前选中的一级分类数据
  selectedClassification: IndicatorTreeClassification | undefined

  // 根据指标 key 获取指标名称
  getIndicatorName: (key: string) => string
}

const IndicatorTreeContext = createContext<IndicatorTreeContextType | null>(null)

// Hook for using indicator tree data and functions
export const useIndicatorTree = () => {
  const context = useContext(IndicatorTreeContext)
  if (!context) {
    throw new Error('useIndicatorTree must be used within IndicatorTreeProvider')
  }
  return context
}

/**
 * @deprecated
 *
 * 不使用 context
 * @param data
 * @returns
 */
export const useIndicatorTreeState = (data: IndicatorTreeClassification[]): IndicatorTreeContextType => {
  const treeParsed = useMemo(() => filterIndicatorTree(data), [data])
  const [selectedFirstLevel, setSelectedFirstLevel] = useState<string>(() =>
    treeParsed.length > 0 ? treeParsed[0].key.toString() : ''
  )

  const checkResult = useIndicatorCheck()

  const selectedClassification = treeParsed.find((item) => item.key.toString() === selectedFirstLevel)

  const getIndicatorName = useCallback(
    (key: string): string => {
      // @ts-expect-error
      return findIndicatorName(treeParsed, key) || key // 如果找不到指标，返回原始 key
    },
    [treeParsed]
  )

  return {
    data: treeParsed,
    selectedFirstLevel,
    setSelectedFirstLevel,
    selectedClassification,
    getIndicatorName,
    ...checkResult,
  }
}

interface IndicatorTreeProviderProps {
  children: React.ReactNode
  data: IndicatorTreeClassification[]
}

export const IndicatorTreeProvider: React.FC<IndicatorTreeProviderProps> = ({ data, children }) => {
  const treeState = useIndicatorTreeState(data)

  return <IndicatorTreeContext.Provider value={treeState}>{children}</IndicatorTreeContext.Provider>
}
