import { CDEFilterItemApi } from '@/FilterItem/conditionItems/type'
import { CDEFilterItemFront, CDEFilterItemUser } from '@/types'
import { CDEFilterCategory, CDELogicOptionValue, CDERankQueryFilterValue } from 'gel-api'
import { MutableRefObject } from 'react'
import { UseFilterOperationsReturn } from './useFilterOperations'

export type UpdateFiltersParams = {
  filter: CDEFilterItemFront
  value?: string[] | string | CDERankQueryFilterValue[]
  search?: string[] | CDERankQueryFilterValue[]
  logic?: CDELogicOptionValue
}

export interface FilterListRef
  extends Pick<UseFilterOperationsReturn, 'resetFilters' | 'setFilters' | 'updateFilterList' | 'filters'> {
  getFilters: () => CDEFilterItemUser[]
}

export interface FilterListInstance extends FilterListRef {
  /** 获取 CDEFilterPanel 实例 */
  getCurrent: () => MutableRefObject<FilterListRef | null>
}

export interface FilterListProps extends CDEFilterItemApi {
  className?: string
  currentFilterConfig?: CDEFilterCategory
  onFilterChange?: (filters: CDEFilterItemUser[]) => void
  initialFilters?: CDEFilterItemUser[]
  style?: React.CSSProperties
}

// 新增 useFilterPanelWatch 相关类型
export type FilterSelector<T> = (filters: CDEFilterItemUser[]) => T

export type UseFilterPanelWatch = {
  <T>(selector: FilterSelector<T>, filterPanelInstance: MutableRefObject<FilterListRef>): T
  (selector: null, filterPanelInstance: MutableRefObject<FilterListRef>): CDEFilterItemUser[]
}
