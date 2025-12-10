import { UpdateFiltersParams } from '@/FilterList'
import { CDEFilterItemUser } from '@/types'
import { isEmpty, isNil } from 'lodash'

/**
 * 构建过滤器项
 */
export const buildFilterItem = (params: UpdateFiltersParams): CDEFilterItemUser => {
  const { filter, value, logic, search } = params
  return {
    title: filter.itemName || '',
    itemId: filter.itemId,
    logic,
    field: filter.itemField,
    value,
    search,
  }
}

/**
 * 更新过滤器配置
 * @param currentFilters - 当前的过滤器列表
 * @param params - 更新参数
 * @returns 更新后的过滤器列表
 */
export const updateCDEFilter = (
  currentFilters: CDEFilterItemUser[],
  params: UpdateFiltersParams
): CDEFilterItemUser[] => {
  const { filter, value, logic, search } = params

  // 查找现有过滤器
  const preFilter = currentFilters.find((item) => item.itemId === filter.itemId)

  // 如果值为空，并且逻辑也为空 移除该过滤器
  if ((isNil(value) || isEmpty(value) || value === '') && isNil(logic)) {
    return currentFilters.filter((item) => item.itemId !== filter.itemId)
  }

  // 如果存在现有过滤器，更新它
  if (preFilter) {
    return currentFilters.map((item) => {
      if (item.itemId !== filter.itemId) return item
      return {
        ...item,
        logic,
        value,
        search,
      }
    })
  } else {
    return [...currentFilters, buildFilterItem(params)]
  }
}
