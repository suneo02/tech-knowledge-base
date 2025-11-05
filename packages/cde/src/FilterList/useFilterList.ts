import { MutableRefObject, useEffect, useRef, useState } from 'react'
import type { FilterListInstance, FilterListRef, FilterSelector, UseFilterPanelWatch } from './types'

/**
 * 创建 CDEFilterPanel 实例
 * @returns CDEFilterPanel 实例
 *
 * 使用示例:
 * ```tsx
 * const [filterPanel] = useCDEFilterPanel()
 *
 * // 重置筛选
 * filterPanel.reset()
 *
 * // 获取筛选条件
 * const filters = filterPanel.filters
 *
 * // 监听筛选条件变化
 * const filters = useFilterPanelWatch(null, filterPanel);
 *
 * return (
 *   <CDEFilterPanel
 *     ref={filterPanel.getFilterPanel()}
 *     currentFilterConfig={currentFilterConfig}
 *   />
 * )
 * ```
 */
export const useCDEFilterList = (): FilterListInstance => {
  const filterPanelRef = useRef<FilterListRef>(null)

  // 用于开发环境下的警告提示
  const warning = useRef(false)

  const warnIfNotReady = () => {
    if (process.env.NODE_ENV !== 'production' && !warning.current) {
      warning.current = true
      console.warn('CDEFilterPanel is not ready. ' + 'Please ensure it is rendered with valid props.')
    }
  }

  // 确保实例只创建一次
  const filterPanelInstance = useRef<FilterListInstance>({
    filters: filterPanelRef.current?.filters || [],
    getFilters() {
      if (!filterPanelRef.current) {
        warnIfNotReady()
        return []
      }
      return filterPanelRef.current.filters || []
    },
    resetFilters: () => {
      if (!filterPanelRef.current) {
        warnIfNotReady()
        return
      }
      return filterPanelRef.current.resetFilters()
    },
    setFilters: (newFilters) => {
      if (!filterPanelRef.current) {
        warnIfNotReady()
        return
      }
      filterPanelRef.current.setFilters(newFilters)
    },
    updateFilterList: (filterParams) => {
      if (!filterPanelRef.current) {
        warnIfNotReady()
        return
      }
      try {
        filterPanelRef.current.updateFilterList(filterParams)
      } catch (error) {
        console.error('Failed to set filters:', error)
      }
    },
    getCurrent() {
      return filterPanelRef
    },
  })

  return filterPanelInstance.current
}

/**
 * 监听筛选面板的值变化
 * @param selector 选择器函数，用于从筛选条件中选择特定的值
 * @param filterPanelInstance 筛选面板实例
 * @returns 选择器返回的值或完整的筛选条件
 *
 * @deprecated 这个没生效 ！！！
 * @example
 * ```tsx
 * // 监听所有筛选条件
 * const allFilters = useFilterPanelWatch(null, filterPanel);
 *
 * // 监听特定的筛选条件
 * const specificFilter = useFilterPanelWatch(
 *   filters => filters.find(f => f.itemId === 'xxx'),
 *   filterPanel
 * );
 * ```
 */
export const useFilterPanelWatch: UseFilterPanelWatch = <T>(
  selector: FilterSelector<T> | null,
  filterPanelInstance: MutableRefObject<FilterListRef | null>
) => {
  const [value, setValue] = useState(() => {
    const filters = filterPanelInstance.current?.getFilters()
    return selector ? selector(filters || []) : filters || []
  })

  useEffect(() => {
    console.log('filterPanelInstance.getFilters()', filterPanelInstance.current?.getFilters())
    const filters = filterPanelInstance.current?.getFilters()
    if (!selector) {
      setValue(filters || [])
      return
    }

    try {
      const result = selector(filters || [])
      setValue(result)
    } catch (error) {
      console.error('Error in filter selector:', error)
    }
  }, [selector, filterPanelInstance.current])

  return value
}
