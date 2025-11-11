import { CDEFilterItem, CDERankQueryFilterValue } from 'gel-api'
import { checkIfCDESearchFilter } from 'gel-ui'

// 更新配置项的value
export const updateFilters = (
  set,
  get,
  {
    filter,
    value,
    logic,
    valueRaw,
    confidence,
  }: {
    filter: CDEFilterItem & { labels4see?: string[] }
    value: string[] | undefined | CDERankQueryFilterValue[]
    logic: any
    /**
     * 级联组件需要完整的 value 来展示，即二维数组
     */
    valueRaw?: any
    confidence?: any
  }
) => {
  console.log('🚀 ~ updateFilters ~ filter:', filter, confidence)
  let { filters, getFilterById } = get()
  const preFilter = getFilterById(filter.itemId)

  if (checkIfCDESearchFilter(filter)) {
    // 榜单名录 搜索类型
    if (value?.length === 0) {
      // 如果数据为空，则删除
      filters = filters.filter((item) => item.itemId !== filter.itemId)
    } else {
      // 否则添加数据
      if (preFilter) {
        // 判断是否存在itemId
        value && (preFilter.search = value)
        logic && (preFilter.logic = logic)
        confidence && (preFilter.confidence = confidence)
        preFilter.valueRaw = valueRaw
      } else {
        filters.push({
          itemId: filter.itemId,
          logic,
          search: value,
          title: filter.itemName,
          field: filter.itemField,
          itemType: filter.itemType,
          valueRaw,
          confidence,
        })
      }
    }
  } else {
    if (value?.length === 0) {
      // 如果数据为空，则删除
      filters = filters.filter((item) => item.itemId !== filter.itemId)
    } else {
      // 否则添加数据
      if (preFilter) {
        // 判断是否存在itemId
        value && (preFilter.value = value)
        logic && (preFilter.logic = logic)
        confidence && (preFilter.confidence = confidence)
        filter.labels4see && (preFilter.labels4see = filter.labels4see)
        preFilter.valueRaw = valueRaw
      } else {
        filters.push({
          itemId: filter.itemId,
          logic,
          value,
          title: filter.itemName,
          field: filter.itemField,
          labels4see: filter.labels4see,
          valueRaw,
          confidence,
        })
      }
    }
  }

  console.log('🚀 ~ updateFilters ~ filters:', filters)

  set({
    filters: [...filters],
  })
}
