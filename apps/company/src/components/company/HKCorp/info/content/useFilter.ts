import { useState, useMemo, useCallback } from 'react'

export interface FilterState {
  pageNo: number
  pageSize: number
  [key: string]: any
}

interface UseFilterProps {
  initialFilter?: FilterState
  nodesFilter?: Record<string, any>
}

export const useFilter = ({ initialFilter, nodesFilter }: UseFilterProps = {}) => {
  // 基础过滤条件
  const defaultFilter = useMemo(
    () => ({
      pageNo: 0,
      pageSize: 10,
      ...nodesFilter,
      ...initialFilter,
    }),
    [nodesFilter, initialFilter]
  )

  const [filter, setFilter] = useState<FilterState>(defaultFilter)
  const [searchFilter, setSearchFilter] = useState<Record<string, any>>()

  // 合并所有过滤条件
  const combinedFilter = useMemo(
    () => ({
      ...filter,
      ...searchFilter,
    }),
    [filter, searchFilter]
  )

  // 更新搜索过滤条件
  const updateSearchFilter = useCallback((newSearchFilter: Record<string, any>) => {
    setSearchFilter((prev) => ({
      ...prev,
      ...newSearchFilter,
    }))
  }, [])

  // 重置过滤条件
  const resetFilter = useCallback(() => {
    setFilter(defaultFilter)
    setSearchFilter(undefined)
  }, [defaultFilter])

  // 更新基础过滤条件
  const updateFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilter((prev) => ({
      ...prev,
      ...newFilter,
    }))
  }, [])

  return {
    filter,
    searchFilter,
    combinedFilter,
    updateSearchFilter,
    updateFilter,
    resetFilter,
    setFilter,
    setSearchFilter,
  }
} 