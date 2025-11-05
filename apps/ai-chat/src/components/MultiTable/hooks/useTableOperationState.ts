import { requestToWFCSuperlistFcs } from '@/api/requestFcs'
import { useTableOperationContext } from '../context'
import { SyncStatus, TableOperation, TableOperationType } from '../types'
import { TableOperationActionType } from '../types/actionTypes'
import { getOperationDescription } from '../utils/operationUtils'

/**
 * 自定义钩子用于处理表格操作状态管理
 * 该钩子提供了记录操作、撤销、重做、清空历史等状态管理功能
 */
export const useTableOperationState = () => {
  const { state, dispatch } = useTableOperationContext()

  /**
   * 记录操作
   * @param operation 需要记录的操作，不包含id、timestamp和disabled属性
   * 该函数负责将操作记录到状态中，如果不在撤销重做过程中，同时记录日志
   */
  const recordOperation = useCallback(
    (operation: TableOperation) => {
      // 生成操作 ID
      const operationId = `${Date.now()}-${Math.random().toString(36).substring(2)}`
      console.log('🚀 ~ useTableOperationState ~ state:', state)

      console.log('🚀 ~ useTableOperationState ~ operationId:', operationId)

      // 先记录用户操作
      dispatch({
        type: TableOperationActionType.RECORD_OPERATION,
        payload: {
          ...operation,
          id: operationId,
        },
      })

      // 同时记录机器操作日志
      if (!state.isUndoRedoInProgress) {
        // 记录初始状态
        dispatch({
          type: TableOperationActionType.RECORD_LOG,
          payload: {
            type: operation.type,
            description: getOperationDescription(operation),
            details: operation as unknown as Record<string, unknown>,
            syncStatus: SyncStatus.PENDING,
            id: operationId,
          },
        })
        // 这里添加如果operation.type是COLUMN_MOVE的那么调用接口
      }
      if (operation.type === TableOperationType.CELL_EDIT) {
        console.log('🚀 ~ useTableOperationState ~ operation:', state)
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'update_cell',
          payload: {
            columnId: operation.columnId,
            rowId: operation.rowId,
            value: operation.newValue,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
          .then(() => {
            dispatch({
              type: TableOperationActionType.UPDATE_LOG_STATUS,
              payload: {
                logId: operationId,
                status: SyncStatus.SUCCESS,
              },
            })
          })
          .catch((err) => {
            console.log('🚀 ~ useTableOperationState ~ err:', err)
            dispatch({
              type: TableOperationActionType.UPDATE_LOG_STATUS,
              payload: {
                logId: operationId,
                status: SyncStatus.FAILED,
                error: JSON.stringify(err),
              },
            })
          })
      } else if (operation.type === TableOperationType.COLUMN_RENAME) {
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'update_column',
          payload: {
            columnId: operation.columnId,
            newColumnName: operation.newName,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
      } else if (operation.type === TableOperationType.COLUMN_MOVE) {
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'move_column',
          payload: {
            columnId: operation.columnId,
            newColumnIndex: operation.newIndex,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
      } else if (operation.type === TableOperationType.COLUMN_INSERT) {
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'add_column',
          payload: {
            columnId: operation.columnId,
            columnName: operation.columnName,
            columnIndex: operation.columnIndex + 1,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
      } else if (operation.type === TableOperationType.COLUMN_DELETE) {
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'delete_column',
          payload: {
            columnId: operation.columnId,
            isDelete: true,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
      } else if (operation.type === TableOperationType.ROW_DELETE) {
        requestToWFCSuperlistFcs('superlist/excel/operation', {
          cmd: 'delete_row',
          payload: {
            rowId: operation.rowId,
          },
          sheetId: state.sheetId!,
          operationNo: state.operationNo + 1,
        })
        dispatch({
          type: TableOperationActionType.UPDATE_OPERATION_NO,
        })
      } else {
        // 模拟与后端同步
        setTimeout(() => {
          const success = Math.random() > 0.3 // 70% 的成功率
          dispatch({
            type: TableOperationActionType.UPDATE_LOG_STATUS,
            payload: {
              logId: operationId,
              status: success ? SyncStatus.SUCCESS : SyncStatus.FAILED,
              error: success ? undefined : '模拟错误',
            },
          })
        }, 2000)
      }
    },
    [dispatch, state.isUndoRedoInProgress, state.operationNo, state.sheetId]
  )

  /**
   * 撤销操作
   * 该函数检查当前是否有可撤销的操作，如果有，则触发撤销动作并记录撤销日志
   */
  const undo = useCallback(() => {
    if (state.currentIndex >= 0) {
      const currentOperation = state.operations[state.currentIndex]
      const operationId = `${Date.now()}-${Math.random().toString(36).substring(2)}`

      dispatch({ type: TableOperationActionType.UNDO })

      // 记录撤销日志
      dispatch({
        type: TableOperationActionType.RECORD_LOG,
        payload: {
          type: TableOperationType.UNDO,
          description: `撤销了 ${getOperationDescription(currentOperation)}`,
          details: { targetOperationId: currentOperation.id },
          syncStatus: SyncStatus.PENDING,
          id: operationId,
        },
      })

      // 模拟与后端同步
      // setTimeout(() => {
      //   const success = Math.random() > 0.3 // 70% 的成功率
      //   dispatch({
      //     type: 'UPDATE_LOG_STATUS',
      //     payload: {
      //       logId: operationId,
      //       status: success ? SyncStatus.SUCCESS : SyncStatus.FAILED,
      //     },
      //   })
      // }, 2000)
      dispatch({
        type: TableOperationActionType.UPDATE_OPERATION_NO,
      })
      requestToWFCSuperlistFcs('superlist/excel/operation', {
        cmd: 'undo',
        sheetId: state.sheetId!,
        operationNo: state.operationNo + 1,
      })
    }
  }, [dispatch, state.currentIndex, state.operations, state.operationNo])

  /**
   * 重做操作
   * 该函数检查当前是否有可重做的操作，如果有，则触发重做动作并记录重做日志
   */
  const redo = useCallback(() => {
    if (state.currentIndex < state.operations.length - 1) {
      const nextOperation = state.operations[state.currentIndex + 1]
      const operationId = `${Date.now()}-${Math.random().toString(36).substring(2)}`

      dispatch({ type: TableOperationActionType.REDO })

      // 记录重做日志
      dispatch({
        type: TableOperationActionType.RECORD_LOG,
        payload: {
          type: TableOperationType.REDO,
          description: `重做了 ${getOperationDescription(nextOperation)}`,
          details: { targetOperationId: nextOperation.id },
          syncStatus: SyncStatus.PENDING,
          id: operationId,
        },
      })

      // 模拟与后端同步
      dispatch({
        type: TableOperationActionType.UPDATE_OPERATION_NO,
      })
      requestToWFCSuperlistFcs('superlist/excel/operation', {
        cmd: 'redo',
        sheetId: state.sheetId!,
        operationNo: state.operationNo + 1,
      })
    }
  }, [dispatch, state.currentIndex, state.operations, state.operationNo])

  /**
   * 标记撤销重做开始
   * 该函数用于标记撤销或重做过程的开始
   */
  const markUndoRedoStart = useCallback(() => {
    dispatch({ type: TableOperationActionType.MARK_UNDO_REDO_START })
  }, [dispatch])

  /**
   * 标记撤销重做结束
   * 该函数用于标记撤销或重做过程的结束
   */
  const markUndoRedoEnd = useCallback(() => {
    dispatch({ type: TableOperationActionType.MARK_UNDO_REDO_END })
  }, [dispatch])

  /**
   * 清空历史
   * 该函数用于清空所有操作历史
   */
  const clearHistory = useCallback(() => {
    dispatch({ type: TableOperationActionType.CLEAR_HISTORY })
  }, [dispatch])

  /**
   * 获取有效的操作（未被禁用的）
   * @returns 过滤掉禁用的操作后剩余的操作列表
   */
  const getActiveOperations = useCallback(() => {
    return state.operations.filter((op) => !op.disabled)
  }, [state.operations])

  // /**
  //  * 获取所有操作日志
  //  * @returns 所有的操作日志列表，包含同步状态
  //  */
  // const getOperationLogs = useCallback(() => {
  //   return state.operations.map((operation) => ({
  //     type: operation.type,
  //     timestamp: operation.timestamp,
  //     description: getOperationDescription(operation),
  //     syncStatus: operation.syncStatus || SyncStatus.PENDING,
  //   }))
  // }, [state.operations])

  return {
    operations: state.operations,
    operationLogs: state.operationLogs,
    currentIndex: state.currentIndex,
    canUndo: state.currentIndex >= 0,
    canRedo: state.currentIndex < state.operations.length - 1,
    isUndoRedoInProgress: state.isUndoRedoInProgress,

    recordOperation,
    undo,
    redo,
    markUndoRedoStart,
    markUndoRedoEnd,
    clearHistory,
    getActiveOperations,
  }
}
