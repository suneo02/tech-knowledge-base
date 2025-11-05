import { TableActionType } from '../context/VisTableContext'
import { ColumnDefine } from '@visactor/vtable'
import { SortState } from '@visactor/vtable/es/ts-types'
import { CellMetadata, Column, SourceTypeEnum } from 'gel-api'

// 定义操作类型枚举
export enum VisTableOperationType {
  CELL_RUN = 'CELL_RUN', // 运行单元格

  SET_CELL_VALUE = 'SET_CELL_VALUE',
  COLUMN_ADD = 'COLUMN_ADD',
  COLUMN_DELETE = 'COLUMN_DELETE',
  COLUMN_MOVE = 'COLUMN_MOVE',
  COLUMN_RENAME = 'COLUMN_RENAME',
  COLUMN_TOGGLE_DISPLAY = 'COLUMN_TOGGLE_DISPLAY',

  RECORD_ADD = 'RECORD_ADD',
  DELETE_RECORDS = 'DELETE_RECORDS',
  SET_RECORDS = 'SET_RECORDS',
  UNDO = 'UNDO',
  REDO = 'REDO',

  CELL_SELECTED_WITH_SOURCE = 'CELL_SELECTED_WITH_SOURCE',
}

// 同步状态枚举
export enum SyncStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

// 基础操作接口
export interface BaseOperation {
  type: VisTableOperationType
  timestamp: string
  syncStatus: keyof typeof SyncStatus
  error?: string
}

// 单元格值设置操作
export interface SetCellValueOperation extends BaseOperation {
  type: VisTableOperationType.SET_CELL_VALUE
  payload: {
    col: number
    row: number
    rawValue?: string | number
    currentValue?: string | number
    changedValue: string | number
    noRecord?: boolean
    meta?: CellMetadata
  }
}

// 添加列操作
export interface AddColumnOperation extends BaseOperation {
  type: VisTableOperationType.COLUMN_ADD
  payload: {
    column: Column
    col: number
  }
}

// 删除列操作
export interface DeleteColumnOperation extends BaseOperation {
  type: VisTableOperationType.COLUMN_DELETE
  payload: {
    col: number
    column: ColumnDefine | Column
  }
}

// 移动列操作
export interface MoveColumnOperation extends BaseOperation {
  type: VisTableOperationType.COLUMN_MOVE
  payload: {
    fromCol: number
    toCol: number
    title: string
    columnId: string
  }
}

// 移动列操作
export interface RenameColumnOperation extends BaseOperation {
  type: VisTableOperationType.COLUMN_RENAME
  payload: {
    columnId: string
    changedValue: string
    currentValue: string
  }
}

// 隐藏/显示 列
export interface toggleDisplayColumnOperation extends BaseOperation {
  type: VisTableOperationType.COLUMN_TOGGLE_DISPLAY
  payload: {
    columnId: string
    isHidden: boolean
  }
}

// 添加行操作
export interface AddRecordOperation extends BaseOperation {
  type: VisTableOperationType.RECORD_ADD
  payload: {
    record: CellMetadata
    index: number
  }
}

// 删除行操作
export interface DeleteRecordsOperation extends BaseOperation {
  type: VisTableOperationType.DELETE_RECORDS
  payload: {
    row: number
    rowId: string
  }[]
}

// 设置所有记录操作
export interface SetRecordsOperation extends BaseOperation {
  type: VisTableOperationType.SET_RECORDS
  payload: {
    records: Record<string, unknown>[]
    originalRecords: Record<string, unknown>[]
    sortState?: SortState | SortState[] | null
  }
}

// 撤销操作
export interface UndoOperation extends BaseOperation {
  type: VisTableOperationType.UNDO
  payload: {
    operationId: number
  }
}

// 重做操作
export interface RedoOperation extends BaseOperation {
  type: VisTableOperationType.REDO
  payload: {
    operationId: number
  }
}

export interface CellRunOperation extends BaseOperation {
  type: VisTableOperationType.CELL_RUN
  payload: {
    col: number
    row: number
  }
}

export interface CellSelectedWithSourceOperation extends BaseOperation {
  type: VisTableOperationType.CELL_SELECTED_WITH_SOURCE
  payload: {
    sourceId: string
    sourceType: SourceTypeEnum
    value?: string
  }
}

// 所有可能的操作类型联合
export type VisTableOperation =
  | SetCellValueOperation
  | AddColumnOperation
  | DeleteColumnOperation
  | AddRecordOperation
  | DeleteRecordsOperation
  | SetRecordsOperation
  | UndoOperation
  | RedoOperation
  | CellRunOperation
  | MoveColumnOperation
  | RenameColumnOperation
  | toggleDisplayColumnOperation

// 操作日志记录接口
export interface VisTableOperationLog {
  id: string
  type: TableActionType | 'UNDO' | 'REDO'
  timestamp: number
  description: string
  details: Record<string, unknown>
  syncStatus: SyncStatus
  error?: string
}

export type OperationCommand =
  | 'add_column'
  | 'delete_records'
  | 'set_records'
  | 'set_cell_value'
  | 'run_cell'
  | 'add_row'
  | 'delete_column'
  | 'move_column'
  | 'update_column'
  | 'update_cell'

export interface BaseOperationParams {
  sheetId: number
  operationNo: number
}

export interface AddColumnParams extends BaseOperationParams {
  column: Column
  columnIndex: number
}

export interface DeleteRecordsParams extends BaseOperationParams {
  indices: number[]
}

export interface AddRecordParams extends BaseOperationParams {
  record: Record<string, unknown>
  index: number
}

export interface SetRecordsParams<T> extends BaseOperationParams {
  records: T[]
}

export interface SetCellValueParams extends BaseOperationParams {
  col: number
  row: number
  value: string | number
}

export interface RunCellParams extends BaseOperationParams {
  col: number
  row: number
}

export interface TableOperationRequest {
  cmd: OperationCommand
  sheetId: number
  operationNo: number
  payload: {
    // 添加列
    columnId?: string
    columnName?: string
    columnIndex?: number
    // 删除记录
    indices?: number[]
    // 设置记录
    records?: Record<string, unknown>[]
    // 设置单元格值和运行单元格
    col?: number
    row?: number
    value?: string | number
  }
}

export type OperationParams =
  | AddColumnParams
  | DeleteRecordsParams
  | SetRecordsParams<unknown>
  | SetCellValueParams
  | RunCellParams
  | AddRecordParams
