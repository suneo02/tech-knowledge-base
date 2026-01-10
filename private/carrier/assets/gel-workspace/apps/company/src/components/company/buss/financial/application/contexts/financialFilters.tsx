/**
 * 财务筛选上下文：提供受控的筛选状态（单位、时间、模板、类型、隐藏空行）与更新/重置方法。
 * @author yxlu.calvin
 * @example
 * <FinancialFiltersProvider>
 *   <YourComponent />
 * </FinancialFiltersProvider>
 * // 在组件内：
 * const { filters, updateFilters, resetFilters } = useFinancialFilters()
 * updateFilters({ unitScale: 'TEN_THOUSAND' })
 */
import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { FinancialFilters } from '../../types'

const initialFilters: FinancialFilters = {
  scenarioIdx: 0,
  unitScale: 'TEN_THOUSAND',
  hideEmptyRows: true,
  reportDate: [null, null],
  reportTemplate: '' as any, // 这里的值未来从后端获取
  reportType: '' as any, // 这里的值未来从后端获取
}
// 说明：初始模板与类型由服务端拉取后写入；unitScale 默认元，reportDate 默认空区间
type FiltersAction = { type: 'UPDATE_FILTERS'; payload: Partial<typeof initialFilters> } | { type: 'RESET_FILTERS' }

const filterReducer = (state: typeof initialFilters, action: FiltersAction) => {
  switch (action.type) {
    case 'UPDATE_FILTERS':
      return { ...state, ...action.payload }
    case 'RESET_FILTERS':
      return initialFilters
    default:
      return state
  }
}

const FinancialFiltersContext = createContext<{
  filters: typeof initialFilters
  dispatch: React.Dispatch<FiltersAction>
} | null>(null)

export const FinancialFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters)

  const value = {
    filters,
    dispatch,
  }

  return <FinancialFiltersContext.Provider value={value}>{children}</FinancialFiltersContext.Provider>
}

FinancialFiltersProvider.propTypes = {
  children: PropTypes.node,
}

export const useFinancialFilters = () => {
  const context = useContext(FinancialFiltersContext)
  if (!context) {
    throw new Error('useFinancialFilters must be used within FinancialFiltersProvider')
  }

  const updateFilters = (updates: Partial<typeof initialFilters>) => {
    context.dispatch({ type: 'UPDATE_FILTERS', payload: updates })
  }

  const resetFilters = () => {
    context.dispatch({ type: 'RESET_FILTERS' })
  }

  return {
    filters: context.filters,
    updateFilters,
    resetFilters,
  }
}
