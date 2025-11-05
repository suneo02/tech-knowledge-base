import { wftCommon } from '@/utils/utils.tsx'
import { groupBy, isEmpty, pickBy, uniqBy } from 'lodash'
import { SearchHomeEntryList } from './domestic.ts'
import { SearchHomeCardListOverSea } from './oversea.ts'

export const getHomeEntryList = () => {
  let res = SearchHomeEntryList
  if (wftCommon.is_overseas_config) {
    // 海外访问 card 切换调整
    res = SearchHomeCardListOverSea
  }

  const grouped = groupBy(res, 'key')
  const duplicates = pickBy(grouped, (item) => item.length > 1)
  if (!isEmpty(duplicates)) {
    console.error('~ search home 首页重复项', duplicates)
  }
  return uniqBy(res, 'key')
}
