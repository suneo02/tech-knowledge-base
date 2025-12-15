import { ConfigTableCellJsonConfig, ReportCrossTableJson, ReportDetailTableJson } from 'gel-types'

// 基础表格列配置
export type TableColPropsShared<R = any> = {
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  dataIndex: string
  className?: string
  valueClassName?: string // 值单元格样式
  render?: (value: any, record: any, index?: number) => R
}

// 水平表格列配置 - 适配HorizontalTable组件
export type HorizontalTableColPropsShared<R = any> = TableColPropsShared<R> & {
  // 展示相关
  colSpan?: ConfigTableCellJsonConfig['colSpan'] // 列跨度
}

export type TablePropsCommon = Pick<ReportDetailTableJson, 'title' | 'api' | 'type'> & {
  loading?: boolean
  rowKey?: string
  rowClassName?: string
  showHeader?: boolean
  className?: string
  noDataText?: string
}

export type TablePropsHorizontalShared<R = any> = TablePropsCommon & {
  type: 'horizontalTable'
  columns: HorizontalTableColPropsShared<R>[][]
}

export type TablePropsVerticalShared<R = any> = TablePropsCommon & {
  type: 'verticalTable'
  columns: TableColPropsShared<R>[]
}

export type TablePropsCrossShared<R = any> = TablePropsCommon &
  Pick<ReportCrossTableJson, 'rowHeaders' | 'columnHeader' | 'firstRowFirstColumnConfig'> & {
    type: 'crossTable'
    // 交叉表的列配置，不包含标题和国际化标题 标题从接口中获取
    column: Omit<TableColPropsShared<R>, 'title' | 'titleIntl'>
  }

// 表格属性类型定义
export type TablePropsShared<R = any> =
  | TablePropsVerticalShared<R>
  | TablePropsHorizontalShared<R>
  | TablePropsCrossShared<R>
