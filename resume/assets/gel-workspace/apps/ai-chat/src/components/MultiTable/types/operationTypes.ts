import { ColumnDefine } from '@visactor/vtable'
import { CellValue } from './table'
import { RowData } from 'gel-api'

/**
 * 表格操作类型枚举
 * 定义所有可能的表格操作类型
 */
export enum TableOperationType {
  // 单元格操作
  CELL_EDIT = 'CELL_EDIT', // 单元格编辑
  CELL_FILL = 'CELL_FILL', // AI生成列
  CELL_CLEAR = 'CELL_CLEAR', // 清除内容

  // 列操作
  COLUMN_ADD = 'COLUMN_ADD', // 新增列
  COLUMN_DELETE = 'COLUMN_DELETE', // 删除列
  COLUMN_RENAME = 'COLUMN_RENAME', // 重命名列
  COLUMN_UPDATE = 'COLUMN_UPDATE', // 更新列
  COLUMN_MOVE = 'COLUMN_MOVE', // 移动列
  COLUMN_INSERT = 'COLUMN_INSERT', // 插入列
  COLUMN_FORMULA = 'COLUMN_FORMULA', // 运行列（公式列）

  // 行操作
  ROW_DELETE = 'ROW_DELETE', // 删除行
  ROW_ADD = 'ROW_ADD', // 添加行

  // 历史操作
  UNDO = 'UNDO', // 撤销
  REDO = 'REDO', // 重做

  // 添加表头和数据
  DATA_ADD = 'DATA_ADD', // 添加数据
}

/**
 * 同步状态枚举
 * 定义操作的同步状态
 */
export enum SyncStatus {
  PENDING = 'PENDING', // 等待同步
  SUCCESS = 'SUCCESS', // 同步成功
  FAILED = 'FAILED', // 同步失败
}

/**
 * 基础操作接口
 * 所有操作类型的基础接口
 */
export interface BaseOperation {
  id?: string // 操作ID
  type: TableOperationType // 操作类型
  timestamp?: number // 操作时间戳
  isFromUndoRedo?: boolean // 标记操作是否来自撤销重做
  disabled?: boolean // 标记操作是否被禁用（撤销）
  syncStatus?: SyncStatus // 操作同步状态
  error?: string // 操作错误信息
}

/**
 * 单元格编辑操作接口
 */
export interface CellEditOperation extends BaseOperation {
  type: TableOperationType.CELL_EDIT
  columnId: string // 列ID
  rowId: string // 行ID
  oldValue: CellValue // 旧值
  newValue: CellValue // 新值
  col: number // 列索引
  row: number // 行索引
}

/**
 * 列移动操作接口
 */
export interface ColumnMoveOperation extends BaseOperation {
  type: TableOperationType.COLUMN_MOVE
  columnId: string // 列ID
  oldIndex: number // 旧索引
  newIndex: number // 新索引
  editor?: string // 编辑器
  headerEditor?: string // 表头编辑器
  width?: number // 列宽
}

/**
 * 列插入操作接口
 */
export interface ColumnInsertOperation extends BaseOperation {
  type: TableOperationType.COLUMN_INSERT
  columnId: string // 列ID
  columnIndex: number // 列索引
  columnName: string // 列名
  editor?: string // 编辑器
  headerEditor?: string // 表头编辑器
  width?: number // 列宽
}

/**
 * 列删除操作接口
 */
export interface ColumnDeleteOperation extends BaseOperation {
  type: TableOperationType.COLUMN_DELETE
  columnId: string // 列ID
  column: ColumnDefine // 列配置
  col: number // 列索引
}

/**
 * 列重命名操作接口
 */
export interface ColumnRenameOperation extends BaseOperation {
  type: TableOperationType.COLUMN_RENAME
  columnId: string // 列ID
  oldName: string // 旧名称
  newName: string // 新名称
  col: number // 列索引
}

/**
 * 行删除操作接口
 */
export interface RowDeleteOperation extends BaseOperation {
  type: TableOperationType.ROW_DELETE
  rowId: string // 行ID
  rowItem: RowData
  row: number // 行索引
}

/**
 * 行添加操作接口
 */
export interface RowAddOperation extends BaseOperation {
  type: TableOperationType.ROW_ADD
}
/**
 * 操作日志记录接口
 */
export interface OperationLog {
  id: string // 日志ID
  type: TableOperationType // 操作类型
  timestamp: number // 时间戳
  description: string // 描述
  details: Record<string, unknown> // 详情
  syncStatus: SyncStatus // 同步状态
  error?: string // 错误信息
}

/**
 * 行添加操作接口
 */
export interface UndoOperation extends BaseOperation {
  type: TableOperationType.UNDO
}

/**
 * 行添加操作接口
 */
export interface RedoOperation extends BaseOperation {
  type: TableOperationType.REDO
}

/**
 * 表格操作类型
 * 所有操作类型的联合类型
 */
export type TableOperation =
  | CellEditOperation
  | ColumnMoveOperation
  | ColumnInsertOperation
  | ColumnDeleteOperation
  | ColumnRenameOperation
  | RowDeleteOperation
  | RowAddOperation
  | UndoOperation
  | RedoOperation
