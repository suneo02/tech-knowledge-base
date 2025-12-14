import { CDEFilterItemUser } from '@/types'
import { useResetState } from 'ahooks'
import { CDEFilterItem } from 'gel-api'
import { useCallback } from 'react'
import { buildFilterItem, updateCDEFilter } from '../handle/updateFilters'
import { UpdateFiltersParams } from './types'

/**
 * hook return type
 */
export type UseFilterOperationsReturn = {
  filters: CDEFilterItemUser[]
  setFilters: (filters: CDEFilterItemUser[]) => void
  resetFilters: () => void
  updateFilter: (params: UpdateFiltersParams) => void
  getFilterById: (itemId: CDEFilterItem['itemId']) => CDEFilterItemUser | undefined
  removeFilter: (itemId: CDEFilterItem['itemId']) => void
  /**
   * 批量更新筛选条件
   * @param params 更新参数
   */
  updateFilterList: (params: UpdateFiltersParams[]) => void
}

const defaultFilters: UseFilterOperationsReturn['filters'] = [
  {
    title: '营业状态',
    itemId: 77,
    logic: 'any',
    field: 'govlevel',
    value: ['存续'],
  },
  {
    title: '机构类型',
    itemId: 78,
    logic: 'any',
    field: 'data_from',
    value: ['298010000,298020000,298040000'],
  },
]

/**
 *
 * TODO default filters 从外部传入
 * 数据筛选操作
 * @param param0
 * @returns
 */
export const useFilterOperations = (initialFilters?: CDEFilterItemUser[]): UseFilterOperationsReturn => {
  const [filters, setFilters, resetFilters] = useResetState<UseFilterOperationsReturn['filters']>(
    initialFilters || defaultFilters
  )

  const updateFilter = useCallback<UseFilterOperationsReturn['updateFilter']>((params) => {
    setFilters((prevFilters) => updateCDEFilter(prevFilters, params))
  }, [])

  const getFilterById = useCallback<UseFilterOperationsReturn['getFilterById']>(
    (itemId: CDEFilterItem['itemId']) => filters.find((item) => item.itemId === itemId),
    [filters]
  )

  const removeFilter = useCallback<UseFilterOperationsReturn['removeFilter']>((itemId) => {
    setFilters((prevFilters) => prevFilters.filter((item) => item.itemId !== itemId))
  }, [])

  const updateFilterList = useCallback<UseFilterOperationsReturn['updateFilterList']>((params) => {
    setFilters(params.map(buildFilterItem))
  }, [])

  return {
    // State
    filters,
    setFilters,
    resetFilters,

    // Operations
    updateFilter,
    getFilterById,
    removeFilter,
    updateFilterList,
  }
}
