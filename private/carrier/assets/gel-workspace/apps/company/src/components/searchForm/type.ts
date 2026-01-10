import { SearchHistoryParsed } from 'gel-api'
import { RecentViewItem } from './searchList/type'

type CommonProps = {
  wrapperClassName?: string
  /**
   * 搜索建议列表
   */
  searchList?: any
  /**
   * 搜索框的placeholder
   */
  placeHolder: any
  /**
   * 搜索请求
   */
  searchRequest?: any
  /**
   * 点击搜索结果或搜素按钮跳转列表页的方法
   */
  goSearchListDetail: (item: { searchFlag?: 'btn' | 'history'; country?: string; [key: string]: any }) => void
  /**
   * 是否显示国家/地区选择器
   */
  showSelect?: any
  /**
   * 页面标志
   */
  pageFlag?: string
  /**
   *  历史记录存储时机，'click'表示点击搜索按钮或历史记录时存储，'onSearch'表示搜索框请求后存储
   */
  historyAddTiming?: 'click' | 'onSearch'
  /**
   * 自定义容器类名
   */
  className?: string
  /**
   * 搜索按钮的文本
   */
  searchText?: string
  searchBtnClassName?: string
  /**
   * 搜索输入框的自定义类名
   */
  searchInputClassName?: string
  /**
   * 搜索关系图标的自定义类名
   */
  searchRelationIconClassName?: string
  /**
   * 是否显示logo
   */
  withLogo?: boolean
}

type WithHistory = {
  onFetchHistory: () => Promise<SearchHistoryParsed>
  /**
   * 清空历史记录
   */
  onClearHistory: () => Promise<void>
  /**
   * 新增历史记录
   */
  onAddHistoryItem: (name: any, value?: any) => Promise<void>
  /**
   * 删除单个历史记录
   */
  onDeleteHistoryItem?: (searchKey: string) => Promise<void>
}

type WithoutHistory = {
  onFetchHistory?: never
  onClearHistory?: never
  onAddHistoryItem?: never
  onDeleteHistoryItem?: never
}

type WithRecentView = {
  /**
   * 最近浏览列表数据（可选，如果不传则会自动获取）
   */
  recentViewList?: RecentViewItem[]
  /**
   * 最近浏览项点击回调
   */
  onRecentViewItemClick?: (item: RecentViewItem) => void
  /**
   * 获取最近浏览列表（可选，如果不传则使用默认API）
   */
  onFetchRecentView?: () => Promise<RecentViewItem[]>
  /**
   * 添加最近浏览项（可选，如果不传则使用默认API）
   */
  onAddRecentViewItem?: (entityId: string, entityName: string) => Promise<void>
  /**
   * 清空最近浏览（可选，如果不传则使用默认API）
   */
  onClearRecentView?: () => Promise<void>
  /**
   * 删除单个最近浏览项（可选，如果不传则使用默认API）
   */
  onDeleteRecentViewItem?: (entityId: string) => Promise<void>
}

type WithoutRecentView = {
  recentViewList?: never
  onRecentViewItemClick?: never
  onFetchRecentView?: never
  onAddRecentViewItem?: never
  onClearRecentView?: never
  onDeleteRecentViewItem?: never
}

export type SearchFormBaseProps = CommonProps & (WithHistory | WithoutHistory) & (WithRecentView | WithoutRecentView)

export type SearchFormProps = SearchFormBaseProps & {
  type?: 'multi'
}
