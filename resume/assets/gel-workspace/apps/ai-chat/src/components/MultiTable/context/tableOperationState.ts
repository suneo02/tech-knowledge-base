import { createContext, useContext } from 'react'
import { OperationLog, TableOperation } from '@/components/MultiTable/types'
import { TableOperationAction } from '@/components/MultiTable/types'
// import { TableOperation, SyncStatus, OperationLog } from '../types/operations'

// Context 状态
export interface TableOperationState {
  operations: TableOperation[] // 所有操作记录
  operationLogs: OperationLog[] // 操作日志（包括撤销重做）
  currentIndex: number // 当前操作索引
  isUndoRedoInProgress: boolean // 是否正在执行撤销重做操作
  isSyncing: boolean // 是否正在同步
  operationNo: number // 操作流水号
  sheetId: number | null // 表格ID
  sheetCanQueryIndicator: boolean // 表格是否可以查询指标
  canAddCdeToCurrent: boolean // CDE是否能添加数据到当前sheet
}

// 初始状态
export const initialState: TableOperationState = {
  operations: [],
  operationLogs: [],
  currentIndex: -1,
  isUndoRedoInProgress: false,
  isSyncing: true,
  operationNo: 0,
  sheetId: null,
  sheetCanQueryIndicator: false,
  canAddCdeToCurrent: false,
}
// 创建 Context
export const TableOperationContext = createContext<{
  state: TableOperationState
  dispatch: React.Dispatch<TableOperationAction>
} | null>(null)

// 基础 Context Hook
export const useTableOperationContext = () => {
  const context = useContext(TableOperationContext)
  if (!context) {
    throw new Error('useTableOperationContext must be used within a TableOperationProvider')
  }
  return context
}
