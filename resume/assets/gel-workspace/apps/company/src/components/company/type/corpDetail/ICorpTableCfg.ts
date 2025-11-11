import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type.ts'
import { TCorpDetailTable } from 'gel-types'
import { IAggResFrontType } from '@/handle/table/aggregation/type'
import { ISearchOptionCfg } from '@/types/configDetail/search.ts'
import { ReactNode } from 'react'

/**
 * @author suneo
 * 企业详情中单独表格配置
 */
export interface ICorpTableCfg {
  enumKey?: TCorpDetailTable
  fn?: string // 不知道干嘛的
  cmd?: string
  f9cmd?: string // f9版本的cmd接口，与cmd接口不同，该接口后端将单独控制fuse和权限等
  ajaxExtras?: any
  companyname?: string
  pageSize?: number
  chartCallback?: (params: any) => void
  tooltips?: ReactNode
  noPagination?: boolean
  bordered?: 'solid' | 'dotted'
  expandDetail?: any
  downDocType?: string
  comment?: boolean | string
  menuClick?: boolean
  bury?: {
    // 埋点配置
    id: number
  }
  hint?: ReactNode
  title?: string
  moreLink?: string

  modelNum: keyof ICorpBasicNumFront | Array<keyof ICorpBasicNumFront> | true | undefined
  modelNumStr?: ReactNode
  modelNumUseTotal?: true // 是否使用总数 展示
  hideTitle?: boolean
  hideWhenNumZero?: boolean
  numHide?: boolean // 是否隐藏统计数字展示

  search?: any // 不知道干嘛的
  thWidthRadio?: string[]
  thName?: string[]
  align?: number[]
  fields?: string[]
  columns?: any[]

  /**
   * @deprecated
   *
   * 用 search options
   */
  rightFilters?: any[]

  noTranslate?: boolean

  chartParams?: (params: any) => any
  chartCmd?: string
  chartTitle?: string
  rowSet?: any
  searchOptionApi?: string
  searchOptions?: ISearchOptionCfg[]
  /**
   * 后端整出来的两种聚合数据类型，恶心人
   */
  searchOptionDataType?: IAggResFrontType
  extraParams?: any
  dataCallback?: any

  notVipTitle?: string
  notVipTips?: string
  /**
   * @deprecated
   */
  notVipPageTitle?: string

  /**
   * @deprecated
   */
  notVipPagedesc?: string

  tabChange?: any

  /**
   * 财务数据等表格 根据单位做筛选的函数
   */
  financialDataFilterFunc?: (params: any) => any
  /**
   * 财务数据等的单位筛选
   */
  financialDataUnitFilter?: any

  needNoneTable?: boolean

  selName?: string[]
  notVipPageTurning?: any
  aggName?: any
  dataComment?: any
  extension?: any
  /**
   * 导出数据前缀
   */
  prefixDownDoc?: ({ companyCode, companyName }: { companyCode: string; companyName: string }) => ReactNode
  rightLink?: any
  typeMergence?: any
  titleStr?: ReactNode
  menuClickFunc?: any
  rightFilterCallback?: (params: any) => any
  rightCascader?: any
  new?: any
  balanceSheetListData?: any
  profitBasicInfoListData?: any
  horizontalTable?: boolean
  hideRowIfEmpty?: boolean
  transFields?: any
  cashflowData?: any
  apiSource?: string
  remark?: ReactNode
  /**
   * 表格数据为空时，隐藏右侧筛选
   */
  rightFilterHideWhenEmpty?: boolean
}
