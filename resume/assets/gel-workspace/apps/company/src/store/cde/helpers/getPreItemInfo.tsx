// 获取原来的item
import { iteratorList } from '@/store/cde/helpers/iteratorList.tsx'

export const getPreItemInfo = (get, itemId) => {
  const { filterConfigList } = get()
  let preItem = {}
  iteratorList(filterConfigList, (item) => {
    if (item.itemId === itemId) preItem = item
  })
  return preItem
}
