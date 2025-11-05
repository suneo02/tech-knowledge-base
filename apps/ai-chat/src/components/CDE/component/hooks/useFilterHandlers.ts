import { message } from '@wind/wind-ui'
import { CDEFilterItemUser, CDELogicDefault, getCDEFiltersTextUtil, isValidUserFilterItem } from 'cde'
import { CDEFilterItem, CDEMeasureItem, getCDEFilterResPayload } from 'gel-api'
import { isNil } from 'lodash'

/**
 * 处理过滤器相关逻辑的静态函数
 *
 * 构建 添加数据至表格的入参
 */
export const buildAddDataToTableCondition = (
  filters: CDEFilterItemUser[],
  measuresOverall: CDEMeasureItem[],
  addNum: number | undefined,
  getFilterItemById: (itemId: CDEFilterItem['itemId']) => CDEFilterItem | undefined,
  codeMap: Record<string, string>
): { description: string; condition: getCDEFilterResPayload } | null => {
  if (addNum == null) {
    message.error('请设置查询范围')
    return null
  }
  if (addNum == 0) {
    message.error('查询结果为空，请重新设置查询条件')
    return null
  }
  const filtersValid = filters.filter((item) => {
    // 用户没有输入值，那么不进行查询
    // 如果用户进行了逻辑选择但是没有输入值，那么也不进行查询
    if (!isValidUserFilterItem(item)) {
      if (item.logic === CDELogicDefault || isNil(item.logic)) {
        console.error('filter value and logic is empty or default', item)
      }
      return false
    }
    return true
  }) as (Omit<CDEFilterItemUser, 'value' | 'title'> & {
    value: NonNullable<CDEFilterItemUser['value']>
    title: NonNullable<CDEFilterItemUser['title']>
  })[]

  const cdeFilterCondition: getCDEFilterResPayload = {
    pageNum: 1,
    pageSize: addNum,
    superQueryLogic: {
      filters: filtersValid,
      measures: measuresOverall,
    },
    order: null,
    largeSearch: false,
    fromTemplate: false,
  }

  return {
    description: getCDEFiltersTextUtil(filtersValid, getFilterItemById, codeMap),
    condition: cdeFilterCondition,
  }
}
