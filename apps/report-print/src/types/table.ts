import {
  HorizontalTableColPropsShared,
  TableColPropsShared,
  TablePropsCrossShared,
  TablePropsHorizontalShared,
  TablePropsShared,
  TablePropsVerticalShared,
} from 'report-util/types'

export type ReportPrintRenderType = string | number | JQuery

// 基础表格列配置
export type TableColProps = TableColPropsShared<ReportPrintRenderType>

// 水平表格列配置 - 适配HorizontalTable组件
export type HorizontalTableColProps = HorizontalTableColPropsShared<ReportPrintRenderType>

export type TablePropsHorizontal = TablePropsHorizontalShared<ReportPrintRenderType>

export type TablePropsVertical = TablePropsVerticalShared<ReportPrintRenderType>

export type TablePropsCross = TablePropsCrossShared<ReportPrintRenderType>

// 表格属性类型定义
export type TableProps = TablePropsShared<ReportPrintRenderType>
