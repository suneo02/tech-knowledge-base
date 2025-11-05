export type HomeFuncItemKey =
  | 'alice'
  | 'newcorps'
  | 'chartplathome'
  | 'bid'
  | 'bidding-query'
  | 'super'
  | 'detach'
  | 'relation'
  | 'oversea-com'
  | 'diligence-platf'
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

export interface SearchHomeItemData {
  key: HomeFuncItemKey
  title: string
  desc: string
  url: string
  fIcon: string
  hot?: boolean
  new?: boolean
}
