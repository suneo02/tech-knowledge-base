import { CorpBasicNumFront, TCorpDetailNodeKey } from '@/src/corpDetail'
import { ConfigDetailApiJSON, ConfigDetailCommentCfg, ConfigDetailTitleJSON } from '../common'
import { ConfigTableCellJsonConfig, ConfigTableCellRenderOptions, ConfigTableCellRenderTypeLiteral } from './cell'

export * from './cell'

/**
 * 表格可能没有标题
 */
type TableJsonCommon = {
  key: TCorpDetailNodeKey
  /**
   * TODO: 需要优化
   */
  countKey?: keyof CorpBasicNumFront
  /**隐藏序号 */
  hideIndex?: boolean
  tooltipTitle?: string
  tooltipTitleIntl?: string
  /**
   * 导出文档类型
   */
  downDocType?: string
  /**
   * 导出文档类型名称
   */
  downDocTypeName?: string
  /**
   * 当模块数为0时，是否隐藏 在报告中
   */
  hideWhenEmptyInReport?: boolean
  tooltips?: string
  /**
   * 是否大数据量模块，如裁判文书等，这类数据 page size 是 10
   */
  isBigData?: boolean

  /**
   * 是否是风控模块
   * 风控模块的数据量提示需要特殊处理
   */
  isRiskModule?: boolean

  /**
   * 注释后缀
   * 支持多语言
   */
  commentSuffixArr?: {
    cn: string
    en: string
  }[]
} & Partial<ConfigDetailTitleJSON> &
  ConfigDetailApiJSON &
  ConfigDetailCommentCfg

/**
 * 详情表格配置
 */
export type ReportHorizontalTableJson = TableJsonCommon & {
  type: 'horizontalTable'

  columns?: ConfigTableCellJsonConfig[][] // 有可能使用父组件的 columns
}

/**
 * 普通表格配置
 */
export type ReportVerticalTableJson = TableJsonCommon & {
  type: 'verticalTable'
  columns?: ConfigTableCellJsonConfig[] // 有可能使用父组件的 columns
}

/**
 * 交叉表格配置
 */
export type ReportCrossTableJson = TableJsonCommon & {
  type: 'crossTable'
  /**
   * 第一行，第一列
   */
  firstRowFirstColumnConfig: ConfigTableCellJsonConfig
  /**
   * 行表头配置
   */
  rowHeaders: ConfigTableCellJsonConfig[]
  /**
   * 列表头配置
   */
  columnHeader: ConfigTableCellJsonConfig
  /**
   * 数据单元格配置，可以是单个配置或配置数组
   * 当为数组时，可以对不同类型的行应用不同的单元格配置
   */
  cellConfig: {
    renderType?: ConfigTableCellRenderTypeLiteral
    renderConfig?: ConfigTableCellRenderOptions
  }
}

export type ReportDetailTableJson = ReportHorizontalTableJson | ReportVerticalTableJson | ReportCrossTableJson
