import { CDEFilterItem, CDERankQueryFilterValue } from 'gel-api'
import { flatten } from 'lodash-es'

/**
 * 判断是否是要用 search 来查询值的 filter
 */
export const checkIfCDESearchFilter = (filter: Pick<CDEFilterItem, 'itemId' | 'itemType'>) => {
  // 榜单名录 搜索类型
  // 来觅赛道
  return filter.itemType === '9' || filter.itemId === 141
}

/**
 * 判断 value 是否是 object name , object id 类型
 */
export const isCDEValueObject = (filter: Pick<CDEFilterItem, 'itemId' | 'itemType'>) => {
  return checkIfCDESearchFilter(filter) || filter.itemType === '91'
}

/**
 * 获得 cde search filter 要展示的 value
 */
export const getCdeSearchFilterDisplayValues = (
  filter: {
    value?: string[] | undefined | CDERankQueryFilterValue[]
    search?: string[] | CDERankQueryFilterValue[]
    logic?: any
    confidence?: any
    valueRaw?: string[][]
  } & Pick<CDEFilterItem, 'itemId' | 'itemType'>
) => {
  try {
    // 如果是 来觅赛道，那么筛选search 中存在与 value raw 的值
    // 因为 来觅赛道会将子节点也存入 search，只有 value raw 才是用户真实选中值
    if (filter.itemId === 141) {
      if (filter.search) {
        const valueRawFlattened = flatten(filter.valueRaw)
        return filter.search?.filter((search) => {
          return valueRawFlattened.find((item) => item === (search as CDERankQueryFilterValue).objectId)
        })
      }
      console.error('来觅赛道 没有 search 值')
    }
    if (checkIfCDESearchFilter(filter)) {
      return filter.search ? filter.search : filter.value
    }
    return filter.value
  } catch (error) {
    console.error(error, filter)
    return filter.value
  }
}
