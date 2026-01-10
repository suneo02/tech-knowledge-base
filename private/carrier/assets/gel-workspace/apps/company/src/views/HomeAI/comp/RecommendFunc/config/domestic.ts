import { isDeveloper } from '@/utils/common.ts'
import { CountDataType } from '@/views/HomeAI'
import { SearchHomeItemData } from '@/views/HomeAI/comp/RecommendFunc/config/type'
import { isNil } from 'lodash'
import { createItem } from './shared'

// For backward compatibility
export const SearchHomeEntryList = (countData?: CountDataType): SearchHomeItemData[] => {
  const items = [
    isDeveloper ? createItem('alice') : null,
    // createItem('cjmd'),
    createItem('yjhzqy'),
    createItem('gjzdxm'),
    createItem('safari'),
    createItem('bidding-query'),
    createItem('thck'),
    createItem('detach'),
    createItem('relation'),
    createItem('wdtk'),
    createItem('batch-output'),
    createItem('chartplathome'),
    createItem('bid', countData),
    createItem('searchmap'),
    createItem('sxwj'),
    createItem('key-parks'),
    createItem('oversea-com'),
    createItem('group-search'),
    createItem('newcorps', countData),
    createItem('sxsj'), // 这项可能在非终端环境下返回 null
    createItem('cksj'),
    createItem('zxcy'),
    createItem('super'),
  ]

  // 过滤掉 null 值
  return items.filter((item): item is SearchHomeItemData => !isNil(item))
}
