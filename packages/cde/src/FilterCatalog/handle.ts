import { useCDEFilterCfgCtx } from '@/ctx'
import { FilterListInstance, UpdateFiltersParams } from '@/FilterList'
import { categoryContainsAnyFilterItem, isValidUserFilterItem } from '@/handle'
import { message } from 'antd'
import { CDESubscribeItem, parseSuperQueryLogic } from 'gel-api'
import { isEmpty, isNil } from 'lodash'

/**
 * 处理订阅相关逻辑的自定义Hook
 *
 * 保存 应用成功后，找到当前的第一个 active 的filter，并且设置 current
 */
export const useSubscriptionHandlers = (
  filterPanelRef: FilterListInstance,
  setCurrent?: (index: number | 'subscribe') => void
) => {
  const { getFilterItemById, filterCfg } = useCDEFilterCfgCtx()

  const handleClickApply = (item: CDESubscribeItem, onSuccess?: () => void) => {
    try {
      const filtersFromSub = parseSuperQueryLogic(item.superQueryLogic)?.filters
      if (!filtersFromSub || isEmpty(filtersFromSub)) {
        console.warn('superQueryLogic is not valid', item.superQueryLogic)
      }

      const filtersFromSubValid = (filtersFromSub ?? []).filter((filter) => isValidUserFilterItem(filter))

      if (isEmpty(filtersFromSubValid)) {
        console.warn('filtersFromSubValid is empty', filtersFromSubValid)
      }

      const validFiltersParam: UpdateFiltersParams[] = filtersFromSubValid
        .map((filter) => {
          const filterItem = getFilterItemById(filter.itemId)
          if (!filterItem) return
          return {
            filter: filterItem,
            value: filter.value,
            logic: filter.logic,
          }
        })
        .filter((item): item is NonNullable<typeof item> => !isNil(item))

      filterPanelRef.updateFilterList(validFiltersParam)

      // 应用成功后设置当前分类
      if (setCurrent && filterCfg && filterCfg.length > 0) {
        // 找到第一个包含有效筛选条件的分类
        let foundIndex = -1
        for (let i = 0; i < filterCfg.length; i++) {
          const hasValidFilterItem = categoryContainsAnyFilterItem(filterCfg[i], filtersFromSubValid)
          if (hasValidFilterItem) {
            foundIndex = i
            break
          }
        }

        // 如果没找到包含有效筛选条件的分类，则设置为第一个分类
        setCurrent(foundIndex >= 0 ? foundIndex : 0)
      }

      message.success('应用成功')
      onSuccess?.()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    handleClickApply,
  }
}
