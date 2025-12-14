import { ReactNode } from 'react'
import {
  HorizontalTableColPropsShared,
  TableColPropsShared,
  TablePropsCrossShared,
  TablePropsHorizontalShared,
  TablePropsShared,
  TablePropsVerticalShared,
} from 'report-util/types'

export type ReportPreviewRenderType = ReactNode

// 基础表格列配置
export type TableColProps = TableColPropsShared<ReportPreviewRenderType>

// 水平表格列配置 - 适配HorizontalTable组件
export type HorizontalTableColProps = HorizontalTableColPropsShared<ReportPreviewRenderType>

export type TablePropsHorizontal = TablePropsHorizontalShared<ReportPreviewRenderType>

export type TablePropsVertical = TablePropsVerticalShared<ReportPreviewRenderType>

export type TablePropsCross = TablePropsCrossShared<ReportPreviewRenderType>

// 表格属性类型定义
export type TableProps = TablePropsShared<ReportPreviewRenderType>
