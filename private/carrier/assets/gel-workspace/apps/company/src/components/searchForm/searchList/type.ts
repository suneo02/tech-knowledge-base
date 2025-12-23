import { CorpGlobalPreSearchResultV1Parsed } from 'gel-api/*'
import { GroupBrowseHistoryItem } from '../../../api/paths/search'

export type SearchItem =
  | {
      name: string
      value: string
      searchFlag?: 'btn' | 'history'
      aiTransFlag?: boolean
      corpNameEng?: string
      corp_name?: string
      corpName?: string
      groupsystem_name?: string
      highlight?: Record<string, any>
      id?: string
    }
  | CorpGlobalPreSearchResultV1Parsed
  | {
      info: {
        clickActiveInfo: CorpGlobalPreSearchResultV1Parsed
        clickActiveRelationInfo: CorpGlobalPreSearchResultV1Parsed
      }
    }

// 最近浏览数据类型 - 重新导出API类型
export type RecentViewItem = GroupBrowseHistoryItem

export type SearchListProps = {
  list: SearchItem[]
  onItemClick: (item: SearchItem) => void
  listFlag: boolean
  showSearchHistoryFlag: boolean
  showTag?: boolean
  onClearHistory?: () => void
  withLogo?: boolean
}

// 最近浏览组件 Props
export type RecentViewListProps = {
  list: RecentViewItem[]
  onItemClick: (item: RecentViewItem) => void
  listFlag: boolean
  onClearRecentView?: () => void
  onDeleteRecentViewItem?: (item: RecentViewItem) => void
}

// 历史搜索和最近浏览容器组件 Props
export type HistoryAndRecentViewProps = {
  // 历史搜索相关
  historyList: SearchItem[]
  onHistoryItemClick: (item: SearchItem) => void
  onClearHistory?: () => void
  onDeleteHistoryItem?: (item: SearchItem) => void

  // 最近浏览相关
  recentViewList: RecentViewItem[]
  onRecentViewItemClick: (item: RecentViewItem) => void
  onClearRecentView?: () => void
  onDeleteRecentViewItem?: (item: RecentViewItem) => void

  // 通用
  listFlag: boolean
}
