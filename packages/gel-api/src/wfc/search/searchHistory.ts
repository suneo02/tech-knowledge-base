// 搜索历史类型
export type SearchHistoryType =
  // 首页顶部搜索
  | 'HOME_HEADER_SEARCH'
  // 企业搜索
  | 'COMPANY_SEARCH'
  // 集团搜索
  | 'GROUP_SEARCH'

  // 招聘搜索
  | 'RECRUITMENT_SEARCH_POSITION'
  | 'RECRUITMENT_SEARCH_COMPANY'

  // 招投标
  | 'BID_SEARCH_TITLE' // 招投标搜索记录-公告标题
  | 'BID_SEARCH_PRODUCT' // 招投标搜索记录-招标产品
  | 'BID_SEARCH_PARTICIPATING_UNIT' // 招投标搜索记录-参与单位
  | 'BID_SEARCH_PURCHASING_UNIT' // 招投标搜索记录-采购单位
  | 'BID_SEARCH_BID_WINNER' // 招投标搜索记录-中标单位

  // 人物搜索
  | 'PEOPLE_SEARCH'

  // 查关系
  | 'RELATION_SEARCH'

  // 榜单名录搜索
  | 'FEATURE_SEARCH'

  // 专利搜索
  | 'PATENT_SEARCH'
  // 商标搜索
  | 'TRADEMARK_SEARCH'

export type SearchHistory = {
  entityId: string
  searchKey: string
}[]

export type SearchHistoryParsed = { entityId: string; searchKey: string; name: string; value: string }[]
