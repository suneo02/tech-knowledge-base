import { useVisTableOperationState } from './useVisTableOperationState'

/**
 * 获取表格操作历史的Hook
 *
 * @param sheetId 表格ID
 * @returns 表格操作历史相关状态和方法
 */
export const useTableOperationsHistory = (sheetId: number) => {
  // 获取操作状态
  const { operationLogs, operations, undo, redo, canUndo, canRedo } = useVisTableOperationState(sheetId)

  // 计算当前操作索引
  const currentIndex = operations.filter((op) => !op.disabled).length

  return {
    // 操作日志记录
    operationLogs,

    // 操作记录
    operations,

    // 撤销能力
    canUndo,

    // 重做能力
    canRedo,

    // 撤销方法
    undo,

    // 重做方法
    redo,

    // 当前操作索引
    currentIndex,
  }
}
