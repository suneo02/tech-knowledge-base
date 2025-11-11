// 获取filter
export const getFilterById = (get, itemId) => {
  const { filters } = get()
  return filters.find((item) => item.itemId === itemId)
}
