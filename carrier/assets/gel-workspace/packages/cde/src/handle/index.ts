import { CDEFilterItemUser } from '@/types'
import { CDEFilterCategory, CDEFilterItem } from 'gel-api'
import { isArray, isEmpty, isNil } from 'lodash'

export * from './filterCDECfg'
export * from './filterText'
export * from './updateFilters'
/**
 * 判断用户筛选项是否有效
 *
 * @param item 用户筛选项
 * @returns {boolean} 如果筛选项有效则返回true，否则返回false
 *
 * 有效条件：
 * 1. item 不为 null 或 undefined
 * 2. 如果 value 是数组，数组不能为空
 * 3. 如果 value 是字符串，不能为空或纯空白字符
 * 4. 如果同时存在 search，search 不能为空或纯空白字符
 */
export const isValidUserFilterItem = (item: CDEFilterItemUser): boolean => {
  if (isNil(item)) return false

  // 如果有 search 字段，检查是否有效
  if (item.search !== undefined && isArray(item.search) && isEmpty(item.search)) {
    return false
  }

  // value 未定义，且没有 search，则无效
  if (item.value === undefined) {
    return item.search !== undefined && isArray(item.search) && !isEmpty(item.search)
  }

  // 检查 value 的有效性
  if (isArray(item.value)) {
    return !isEmpty(item.value)
  }

  return item.value.trim() !== ''
}

/**
 * 检查筛选类别中是否包含指定的用户筛选项
 *
 * @param category 筛选类别，包含newFilterItemList或extraConfig数组属性
 * @param filterItem 用户筛选项
 * @returns {boolean} 如果在分类中找到匹配的筛选项则返回true，否则返回false
 */
export const categoryContainsFilterItem = (category: CDEFilterCategory, filterItem: CDEFilterItemUser): boolean => {
  // 首先验证用户筛选项是否有效
  if (!isValidUserFilterItem(filterItem)) {
    return false
  }

  let found = false

  /**
   * 递归查找匹配的筛选项
   * @param item 当前检查的配置项
   * @returns {void}
   */
  const findMatchingItem = (item: CDEFilterCategory | CDEFilterItem): void => {
    if (found) return

    // Type guard to handle different item types
    const itemList =
      'newFilterItemList' in item ? item.newFilterItemList : 'extraConfig' in item ? item.extraConfig : undefined
    if (!itemList) return

    for (const child of itemList) {
      if (child.itemId === filterItem.itemId) {
        found = true
        return
      }

      if (!found) {
        findMatchingItem(child)
      }
    }
  }

  findMatchingItem(category)
  return found
}

/**
 * 计算筛选类别中有效筛选项的数量
 *
 * @param category 筛选类别
 * @param filters 用户筛选项列表
 * @returns {number} 有效筛选项的数量
 */
export const countMatchingFiltersInCategory = (category: CDEFilterCategory, filters?: CDEFilterItemUser[]): number => {
  if (!filters) {
    return 0
  }
  return filters.reduce((count, filter) => count + (categoryContainsFilterItem(category, filter) ? 1 : 0), 0)
}

/**
 * 检查筛选类别中是否包含至少一个有效的用户筛选项
 *
 * @param category 筛选类别
 * @param filters 用户筛选项列表
 * @returns {boolean} 如果包含至少一个有效的用户筛选项则返回true，否则返回false
 */
export const categoryContainsAnyFilterItem = (category: CDEFilterCategory, filters?: CDEFilterItemUser[]): boolean => {
  if (!filters) {
    return false
  }
  return filters.some((filter) => categoryContainsFilterItem(category, filter))
}
