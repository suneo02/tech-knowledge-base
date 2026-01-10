import SmartHorizontalTable from '@/components/table/SmartHorizontalTable'
import { IAggResFrontType } from '@/handle/table/aggregation/type'
import { ISearchOptionCfg } from '@/types/configDetail/search.ts'
import { ColumnProps } from '@wind/wind-ui-table'
import { TCorpDetailTable } from 'gel-types'
import { ComponentProps, ReactNode } from 'react'
import { CorpDetailRightFilterConfig } from './filter'
import { CorpDetailNodeCfgCommon } from './nodeCommon'

/**
 * @author suneo
 * 企业详情中单独表格配置
 */
export interface CorpTableCfg<D extends Record<string, any> = any> extends CorpDetailNodeCfgCommon {
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

  search?: any // 不知道干嘛的
  thWidthRadio?: string[]
  thName?: string[]
  align?: number[]
  fields?: (keyof D | 'NO.')[]
  columns?: Array<ColumnProps<D> | null | Array<ColumnProps<D>>> | ComponentProps<typeof SmartHorizontalTable>['rows']

  /**
   * @deprecated
   *
   * 用 search options
   */
  rightFilters?: CorpDetailRightFilterConfig[]

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
  /**
   * 模式二（key-translate-official-only）下的“跳过翻译字段列表”。
   * 仅当全局显示模式为模式二时生效；用于避免展示/逻辑字段在该模式被通用翻译。
   */
  skipTransFieldsInKeyMode?: string[]
  cashflowData?: any
  apiSource?: string
  remark?: ReactNode
  /**
   * 表格数据为空时，隐藏右侧筛选
   */
  rightFilterHideWhenEmpty?: boolean
}

// CompanyTable 选项项类型
export interface CompanyTableSelectOptionItem {
  key: string // 显示文本（如 "All Types", "股东信息变更"）
  value: string // 选项值
  doc_count?: number // 文档计数（可选）
}

// CompanyTable 选项组类型 - 每个索引对应一组选项
export type CompanyTableSelectOptionGroup = Record<string, CompanyTableSelectOptionItem[]>

// CompanyTable 完整的选项数据类型 - 数组，每个元素是一个索引对应的选项组
export type CompanyTableSelectOptions = CompanyTableSelectOptionGroup[]
