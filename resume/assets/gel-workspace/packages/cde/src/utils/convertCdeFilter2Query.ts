/**
 * cde 查询数据之前先 convert 一下
 */
export const convertCdeFilter2Query = (filters: any) => {
  if (!filters || !filters.length) return []

  return filters.map((filter: any) => {
    if (filter.itemType === '9') {
      return {
        ...filter,
        search: filter.search ? filter.search : filter.value,
      }
    }
    return filter
  })
}
