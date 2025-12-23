import { TRequestToWFC } from 'gel-api'
import { CorpPreSearchResult } from 'gel-types'
import { CorpPresearchModule } from './historyEnum'

// 定义组件暴露的方法接口
export interface CorpPresearchRef {
  clearSelection: () => void
  getSelectedValues: () => string[]
  getSelectedOptions: () => SelectOption[]
}

type CorpPreSearch = TRequestToWFC<'search/company/getGlobalCompanyPreSearch'>

export interface CorpPresearchProps {
  initialValue?: string // 初始展示值
  placeholder?: string // 输入框提示
  onChange?: (corpId: string, corpName: string, data: CorpPreSearchResult) => void // 选中回调
  debounceTime?: number // 防抖时间
  withSearch?: boolean // 是否显示搜索图标
  withClear?: boolean // 是否显示清除按钮
  widthAuto?: boolean // 是否自动宽度
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' // 下拉框位置
  requestAction?: ({ queryText }: { queryText: string }) => ReturnType<CorpPreSearch> // 请求方法
  minWidth?: number | string // 最小宽度
  onClickItem?: (item: CorpPreSearchResult) => void // 点击选项回调
  onClickHistory?: (any) => void // 点击历史回调
  needHistory?: boolean // 是否需要历史搜索
  searchMode?: 'auto' | 'select' // 单选输入模式-> 如，顶部搜索 | 多项选择模式 -> 如，招聘 企业搜搜
  onSelectChange?: (value: any, option: any) => void
  module?: CorpPresearchModule // 模块名称
  deleteSearchHistoryAll?: (params: any) => Promise<any> // 删除历史搜索
  addSearchHistory?: (key: string, val: string) => Promise<any> // 添加历史搜索
  getSearchHistoryAndSlice?: (params: any) => Promise<any> // 获取历史搜索
  requestDataCallback?: (data: any) => any // 请求数据后二次回调处理（现阶段主要用于支持翻译）
  initialSelectedValues?: string[] // 初始选中值
}

export interface SelectOption {
  id: string // 选项id
  label: React.ReactNode | string
  value: string
  data: CorpPreSearchResult
}

export interface CorpSearchRowProps {
  item: any
  onClick?: (id: string) => void
  onlyLabel?: boolean
}
