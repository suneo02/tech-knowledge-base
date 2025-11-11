import { ProgressStatusEnum, SourceTypeEnum } from '@/types'

/**
 * 通用请求/响应类型
 */
export interface BaseTableRequest {
  tableId: string
}

export interface BaseSheetRequest {
  sheetId: number
}

export enum ColumnDataTypeEnum {
  TEXT = 0, // 文本
  INTEGER = 2, // 整数
  DATE = 3, // 日期
  FLOAT = 4, // 小数
  MAIL = 105, // 邮箱
  WEB = 106, // 网址
  PERCENT = 200, // 百分比
}

/**
 * 单元格元数据类型
 */
export interface CellMetadata {
  processedValue?: string
  status: ProgressStatusEnum
  rowIndex?: number
  columnIndex?: number
  columnId: string
  rowId: string
  cellId: string
  sourceId?: string
  sourceType: SourceTypeEnum
  columnDataType: ColumnDataTypeEnum
}

/**
 * 行数据类型
 */
export interface RowData {
  rowId: string
  [columnId: string]: string | CellMetadata
}

/**
 * Sheet 基础信息
 */
export interface Sheet {
  sheetId: number
  sheetName: string
  sheetIndex: number
  total: number
}

/**
 * 筛选项
 */
export interface FilterItem {
  columnId: string
  filterType: number
  filterValue: string
  joinType: number
}

/**
 * 列定义
 */
export interface Column {
  columnId: string
  columnName?: string
  columnIndex?: number
  columnDataType?: ColumnDataTypeEnum
  filterItems?: FilterItem[]
  initSourceType?: SourceTypeEnum
  isFrozen?: boolean
  title?: string
  width?: string | number
  editor?: string
  headerEditor?: string
  field?: string
  headerIcon?: string
  icon?: string
}

/**
 * 单元格状态项
 */
export interface CellStatusItem {
  cellId: string
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  processedValue: string
  sourceId: string
}
