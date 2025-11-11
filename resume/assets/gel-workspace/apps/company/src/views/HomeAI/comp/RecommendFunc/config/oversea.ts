// 企业库首页功能推荐海外版
import { isNil } from 'lodash'
import { createItem } from './shared'
import { SearchHomeItemData } from './type'

export const SearchHomeCardListOverSea: SearchHomeItemData[] = [
  createItem('newcorps'),
  createItem('chartplathome'),
  createItem('bid'),
  createItem('bidding-query'),
  createItem('super'),
  createItem('detach'),
  createItem('relation'),
  createItem('oversea-com'),
  createItem('group-search'),
].filter((item): item is SearchHomeItemData => !isNil(item)) // 过滤掉可能的 null 值
