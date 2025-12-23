import { useCallback } from 'react'
import { useVisTableOperationContext } from '../context/VisTableOperationContext'
import { VisTableOperation } from '../types/operationTypes'

// // 设置后端同步接口的类型
// interface SyncOperationOptions {
//   onSyncOperation?: (operation: VisTableOperation, sheetId: number, operationNo: number) => Promise<void>
// }

/**
 * 使用表格操作状态的Hook
 * 提供操作日志管理功能
 */
export const useVisTableOperationState = (sheetId: number) => {
  const { state, recordOperation: recordOp, undo: undoOp, redo: redoOp } = useVisTableOperationContext()

  // 获取当前表格的操作记录
  const tableOperations = state.operations.filter((op) => state.tableIdMap[op.id!] === sheetId)
  const tableOperationLogs = state.operationLogs.filter((op) => op.sheetId === sheetId)

  // 记录操作
  const recordOperation = useCallback(
    (
      operation: VisTableOperation,
      onSyncOperation?: (operation: VisTableOperation, sheetId: number) => Promise<void>
    ) => {
      recordOp(operation, sheetId, onSyncOperation)
    },
    [recordOp, sheetId]
  )

  // 撤销操作
  const undo = useCallback(() => {
    return undoOp(sheetId)
  }, [undoOp, sheetId])

  // 重做操作
  const redo = useCallback(() => {
    return redoOp(sheetId)
  }, [redoOp, sheetId])

  // 是否可以撤销
  const canUndo = tableOperations.some((op) => !op.disabled && op.isFromUndoRedo !== true)

  // 是否可以重做
  const canRedo = tableOperations.some((op) => op.disabled && op.isFromUndoRedo !== true)

  return {
    operations: tableOperations,
    operationLogs: tableOperationLogs,
    recordOperation,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
