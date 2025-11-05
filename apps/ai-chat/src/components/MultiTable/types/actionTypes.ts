/**
 * 表格操作状态管理的 Action 类型定义
 * 这些类型用于 dispatch 函数中的 type 字段
 */

import { OperationLog, SyncStatus, TableOperation } from './operationTypes'

// 表格操作状态 Action 类型枚举
export enum TableOperationActionType {
  // 记录操作
  RECORD_OPERATION = 'RECORD_OPERATION',
  // 记录日志
  RECORD_LOG = 'RECORD_LOG',
  // 更新日志状态
  UPDATE_LOG_STATUS = 'UPDATE_LOG_STATUS',
  // 更新操作序号
  UPDATE_OPERATION_NO = 'UPDATE_OPERATION_NO',
  // 设置操作序号
  SET_OPERATION_NO = 'SET_OPERATION_NO',
  // 撤销操作
  UNDO = 'UNDO',
  // 重做操作
  REDO = 'REDO',
  // 标记撤销重做开始
  MARK_UNDO_REDO_START = 'MARK_UNDO_REDO_START',
  // 标记撤销重做结束
  MARK_UNDO_REDO_END = 'MARK_UNDO_REDO_END',
  // 清空历史
  CLEAR_HISTORY = 'CLEAR_HISTORY',
  // 设置表单ID
  SET_SHEET_INFO = 'SET_SHEET_INFO',
}

// export type TableOperationAction =
//   | { type: 'RECORD_OPERATION'; payload: Omit<TableOperation, 'timestamp'> }
//   | { type: 'RECORD_LOG'; payload: Omit<OperationLog, 'timestamp'> }
//   | { type: 'UPDATE_LOG_STATUS'; payload: { logId: string; status: SyncStatus; error?: string } }
//   | { type: 'UPDATE_OPERATION_STATUS'; payload: { operationId: string; status: SyncStatus } }
//   | { type: 'UNDO' }
//   | { type: 'REDO' }
//   | { type: 'MARK_UNDO_REDO_START' }
//   | { type: 'MARK_UNDO_REDO_END' }
//   | { type: 'CLEAR_HISTORY' }
//   | { type: 'SET_OPERATION_NO'; payload: number }
//   | { type: 'UPDATE_OPERATION_NO' }

export type TableOperationActionMap = {
  [TableOperationActionType.RECORD_OPERATION]: {
    payload: Omit<TableOperation, 'timestamp'>
  }
  [TableOperationActionType.RECORD_LOG]: {
    payload: Omit<OperationLog, 'timestamp'>
  }
  [TableOperationActionType.UPDATE_LOG_STATUS]: {
    payload: { logId: string; status: SyncStatus; error?: string }
  }
  // [TableOperationActionType.UPDATE_OPERATION_STATUS]: {
  //   payload: { operationId: string; status: SyncStatus }
  // }
  [TableOperationActionType.SET_OPERATION_NO]: {
    payload: number
  }
  [TableOperationActionType.UPDATE_OPERATION_NO]: {
    payload: number
  }
  [TableOperationActionType.SET_SHEET_INFO]: {
    payload: {
      sheetId: number
      sheetCanQueryIndicator: boolean
      canAddCdeToCurrent: boolean
    }
  }
}

/**
 * 表格操作状态 Action 接口
 * 用于定义 dispatch 函数的参数类型
 */
export interface TableOperationAction {
  type: TableOperationActionType
  payload?: TableOperationActionMap[keyof TableOperationActionMap]['payload']
}
