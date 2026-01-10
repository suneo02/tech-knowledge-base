export type HomeFuncItemKey =
  | 'alice'
  | 'yjhzqy'
  | 'newcorps'
  | 'chartplathome'
  | 'bid'
  | 'bidding-query'
  | 'super'
  | 'detach'
  | 'relation'
  | 'oversea-com'
  | 'group-search'
  | 'safari'
  | 'searchmap'
  | 'batch-output'
  | 'gjzdxm'
  | 'thck'
  | 'wdtk'
  | 'sxwj'
  | 'key-parks'
  | 'sxsj'
  | 'cksj'
  | 'zxcy'
  | 'invest-track'
  | 'trademark'
  | 'patent'
  | 'recruit'
  | 'cjmd' // 超级名单

export interface SearchHomeItemData {
  key: HomeFuncItemKey
  title: string
  desc: string
  url: string
  fIcon: string
  hot?: boolean
  new?: boolean
  typeFunc?: string
}
