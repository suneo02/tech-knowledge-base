import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react'
import { VisTableOperation, SyncStatus, VisTableOperationType } from '../types/operationTypes'
import { nanoid } from 'nanoid'
import { tableOperationService } from '../services/tableOperationService'

// 操作日志记录
export interface OperationLog {
  id: string
  sheetId?: number | null
  type: string
  timestamp: string
  description: string
  syncStatus: SyncStatus
  error?: string
}

// 操作状态
interface VisTableOperationState {
  operations: Array<VisTableOperation & { id: string; disabled?: boolean; isFromUndoRedo?: boolean }>
  operationLogs: OperationLog[]
  tableIdMap: Record<string, number | string> // 操作ID到表格ID的映射
  operationNo: number // 操作编号，用于与后端同步
  canQueryIndicator: boolean // 是否可以查询指标
  canAddCdeToCurrent: boolean // 是否可以添加CDE到当前sheet
}

// 初始状态
const initialState: VisTableOperationState = {
  operations: [],
  operationLogs: [],
  tableIdMap: {},
  operationNo: 0, // 初始操作编号
  canQueryIndicator: false, // 是否可以查询指标
  canAddCdeToCurrent: false, // 是否可以添加CDE到当前sheet
}

// 操作类型
enum VisTableOperationActionType {
  RECORD_OPERATION = 'RECORD_OPERATION',
  UNDO = 'UNDO',
  REDO = 'REDO',
  RECORD_LOG = 'RECORD_LOG',
  UPDATE_LOG_STATUS = 'UPDATE_LOG_STATUS',
  CLEAR_OPERATIONS = 'CLEAR_OPERATIONS',
  SET_OPERATION_NO = 'SET_OPERATION_NO', // 设置操作编号
  SET_CAN_QUERY_INDICATOR = 'SET_CAN_QUERY_INDICATOR', // 设置是否可以查询指标
  SET_CAN_ADD_CDE_TO_CURRENT = 'SET_CAN_ADD_CDE_TO_CURRENT', // 设置是否可以添加CDE到当前sheet
}

// 操作类型接口
interface VisTableOperationAction {
  type: VisTableOperationActionType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Record<string, any>
  sheetId?: number
}

// 操作日志管理器
const operationReducer = (state: VisTableOperationState, action: VisTableOperationAction): VisTableOperationState => {
  switch (action.type) {
    case VisTableOperationActionType.RECORD_OPERATION: {
      const operationId = action.payload?.id || nanoid(14)
      const sheetId = action.sheetId || null

      // 创建新的操作记录
      const newOperation = {
        ...(action.payload as VisTableOperation),
        id: operationId,
        isFromUndoRedo: false,
        disabled: false,
      }

      // 更新tableIdMap
      const newTableIdMap = {
        ...state.tableIdMap,
        [operationId]: sheetId,
      }

      return {
        ...state,
        operations: [...state.operations, newOperation],
        tableIdMap: newTableIdMap,
      }
    }

    case VisTableOperationActionType.UNDO: {
      const sheetId = action.sheetId || ''

      // 获取当前表格的操作
      const tableOperations = state.operations.filter((op) => state.tableIdMap[op.id] === sheetId)

      if (tableOperations.length === 0) return state

      // 找到最近一个未禁用的操作
      const lastActiveIndex = tableOperations.findIndex((op) => !op.disabled)

      if (lastActiveIndex === -1) return state

      // 禁用该操作
      const updatedOperations = state.operations.map((op) => {
        if (op.id === tableOperations[lastActiveIndex].id) {
          return { ...op, disabled: true }
        }
        return op
      })

      return {
        ...state,
        operations: updatedOperations,
      }
    }

    case VisTableOperationActionType.REDO: {
      const sheetId = action.sheetId || ''

      // 获取当前表格的操作
      const tableOperations = state.operations.filter((op) => state.tableIdMap[op.id] === sheetId)

      if (tableOperations.length === 0) return state

      // 找到最近一个被禁用的操作
      const firstDisabledIndex = tableOperations.findIndex((op) => op.disabled)

      if (firstDisabledIndex === -1) return state

      // 启用该操作
      const updatedOperations = state.operations.map((op) => {
        if (op.id === tableOperations[firstDisabledIndex].id) {
          return { ...op, disabled: false }
        }
        return op
      })

      return {
        ...state,
        operations: updatedOperations,
      }
    }

    case VisTableOperationActionType.RECORD_LOG: {
      const payload = action.payload || {}

      const log: OperationLog = {
        id: payload.id || nanoid(),
        sheetId: action.sheetId || null,
        type: payload.type || 'UNKNOWN',
        description: payload.description || '',
        timestamp: payload.timestamp || new Date().toISOString(),
        syncStatus: payload.syncStatus || SyncStatus.PENDING,
        error: payload.error,
      }

      return {
        ...state,
        operationLogs: [...state.operationLogs, log],
      }
    }

    case VisTableOperationActionType.UPDATE_LOG_STATUS: {
      const { logId, status, error } = action.payload || {}

      return {
        ...state,
        operationLogs: state.operationLogs.map((log) =>
          log.id === logId ? { ...log, syncStatus: status, error: error } : log
        ),
      }
    }

    case VisTableOperationActionType.CLEAR_OPERATIONS: {
      const sheetId = action.sheetId

      if (!sheetId) return state

      // 移除指定表格的操作
      const newOperations = state.operations.filter((op) => state.tableIdMap[op.id] !== sheetId)
      const newLogs = state.operationLogs.filter((log) => log.sheetId !== sheetId)

      // 清理tableIdMap
      const newTableIdMap = { ...state.tableIdMap }
      Object.keys(newTableIdMap).forEach((opId) => {
        if (newTableIdMap[opId] === sheetId) {
          delete newTableIdMap[opId]
        }
      })

      return {
        ...state,
        operations: newOperations,
        operationLogs: newLogs,
        tableIdMap: newTableIdMap,
      }
    }

    case VisTableOperationActionType.SET_OPERATION_NO: {
      return {
        ...state,
        operationNo: action.payload?.operationNo || 0,
      }
    }

    case VisTableOperationActionType.SET_CAN_QUERY_INDICATOR: {
      return {
        ...state,
        canQueryIndicator: action.payload?.canQueryIndicator || false,
      }
    }

    case VisTableOperationActionType.SET_CAN_ADD_CDE_TO_CURRENT: {
      return {
        ...state,
        canAddCdeToCurrent: action.payload?.canAddCdeToCurrent || false,
      }
    }
    default:
      return state
  }
}

// 创建上下文
interface VisTableOperationContextType {
  state: VisTableOperationState
  initOperationNo: (sheetId: number) => Promise<void> // 初始化操作编号
  recordOperation: (
    operation: VisTableOperation,
    sheetId: number,
    onSyncOperation?: (operation: VisTableOperation, sheetId: number, operationNo: number) => Promise<void>
  ) => void
  undo: (sheetId: number) => boolean
  redo: (sheetId: number) => boolean
  clearOperations: (sheetId: number) => void
}

const VisTableOperationContext = createContext<VisTableOperationContextType>({
  state: initialState,
  initOperationNo: async () => {},
  recordOperation: () => {},
  undo: () => false,
  redo: () => false,
  clearOperations: () => {},
})

// Provider组件
interface VisTableOperationProviderProps {
  children: ReactNode
  sheetId?: number
}

export const VisTableOperationProvider: React.FC<VisTableOperationProviderProps> = ({ children, sheetId }) => {
  const [state, dispatch] = useReducer(operationReducer, initialState)

  // 初始化操作编号
  const initOperationNo = useCallback(
    async (sheetId: number) => {
      try {
        if (!sheetId) return
        const result = await tableOperationService.getSheetVersion(sheetId)
        console.log('🚀 ~ result:', result)

        dispatch({
          type: VisTableOperationActionType.SET_OPERATION_NO,
          payload: { operationNo: result.operationNoComplete },
        })
        dispatch({
          type: VisTableOperationActionType.SET_CAN_QUERY_INDICATOR,
          payload: { canQueryIndicator: result.canQueryIndicator },
        })
        dispatch({
          type: VisTableOperationActionType.SET_CAN_ADD_CDE_TO_CURRENT,
          payload: { canAddCdeToCurrent: result.canAddCdeToCurrent },
        })
        console.log('初始化操作编号:', result.operationNoComplete)
      } catch (error) {
        console.error('获取操作编号失败:', error)
      }
    },
    [dispatch]
  )

  // 组件挂载时初始化操作编号
  useEffect(() => {
    if (sheetId) {
      initOperationNo(sheetId)
    }
  }, [sheetId, initOperationNo])

  // 获取操作描述
  const getOperationDescription = (operation: VisTableOperation): string => {
    switch (operation.type) {
      case VisTableOperationType.SET_CELL_VALUE:
        return `修改单元格(${operation.payload.col}, ${operation.payload.row})的值为 ${operation.payload.changedValue}`
      case VisTableOperationType.CELL_RUN:
        return `运行单元格(${operation.payload.col}, ${operation.payload.row})`
      case VisTableOperationType.COLUMN_ADD:
        return `在第 ${operation.payload.col + 1} 列添加新列【${operation.payload.column.title}】`
      case VisTableOperationType.COLUMN_DELETE:
        return `删除第 ${operation.payload.col} 列【${operation.payload.column.title}】`
      case VisTableOperationType.COLUMN_MOVE:
        return `列【${operation.payload.title}】从第 ${operation.payload.fromCol}  -> 第 ${operation.payload.toCol} 列 `
      case VisTableOperationType.COLUMN_RENAME:
        return `修改列【${operation.payload.currentValue}】的值为 【${operation.payload.changedValue}】`
      case VisTableOperationType.RECORD_ADD:
        return `在第 ${operation.payload.index + 1} 行位置添加新行`

      case VisTableOperationType.SET_RECORDS:
        return `设置表格数据，共 ${operation.payload.records.length} 条记录`
      case VisTableOperationType.DELETE_RECORDS:
        return `删除数据记录${operation.payload.map((res) => `第${res.row}行`)}，共 ${operation.payload.length} 条`
      case VisTableOperationType.UNDO:
        return `撤销操作`
      case VisTableOperationType.REDO:
        return `重做操作`
      default:
        return `执行操作 ${operation.type}`
    }
  }

  // 记录操作
  const recordOperation = useCallback(
    (
      operation: VisTableOperation,
      sheetId: number,
      onSyncOperation?: (operation: VisTableOperation, sheetId: number, operationNo: number) => Promise<void>
    ) => {
      const operationId = nanoid()

      // 记录操作
      dispatch({
        type: VisTableOperationActionType.RECORD_OPERATION,
        payload: operation,
        sheetId,
      })

      // 记录日志
      dispatch({
        type: VisTableOperationActionType.RECORD_LOG,
        payload: {
          type: operation.type,
          description: getOperationDescription(operation),
          syncStatus: SyncStatus.PENDING,
          id: operationId,
          timestamp: new Date().toISOString(),
        },
        sheetId,
      })

      // 操作编号自增
      const currentOperationNo = state.operationNo + 1
      console.log('记录操作，operationNo从', state.operationNo, '增加到', currentOperationNo)
      dispatch({
        type: VisTableOperationActionType.SET_OPERATION_NO,
        payload: { operationNo: currentOperationNo },
      })

      // 执行同步操作
      if (onSyncOperation) {
        // 异步同步操作
        onSyncOperation(operation, sheetId, currentOperationNo)
          .then(() => {
            dispatch({
              type: VisTableOperationActionType.UPDATE_LOG_STATUS,
              payload: {
                logId: operationId,
                status: SyncStatus.SUCCESS,
              },
            })
          })
          .catch((error) => {
            dispatch({
              type: VisTableOperationActionType.UPDATE_LOG_STATUS,
              payload: {
                logId: operationId,
                status: SyncStatus.FAILED,
                error: error instanceof Error ? error.message : String(error),
              },
            })
          })
      } else {
        // 模拟同步成功
        setTimeout(() => {
          dispatch({
            type: VisTableOperationActionType.UPDATE_LOG_STATUS,
            payload: {
              logId: operationId,
              status: SyncStatus.SUCCESS,
            },
          })
        }, 500)
      }
    },
    [dispatch, getOperationDescription]
  )

  // 撤销操作
  const undo = useCallback(
    (sheetId: number): boolean => {
      // 获取当前表格的操作
      const tableOperations = state.operations.filter((op) => state.tableIdMap[op.id] === sheetId)

      // 检查是否有可撤销的操作
      const canUndo = tableOperations.some((op) => !op.disabled)

      if (!canUndo) return false

      // 执行撤销
      dispatch({
        type: VisTableOperationActionType.UNDO,
        sheetId,
      })

      // 记录撤销日志
      dispatch({
        type: VisTableOperationActionType.RECORD_LOG,
        payload: {
          type: 'UNDO',
          description: '撤销操作',
          syncStatus: SyncStatus.SUCCESS,
        },
        sheetId,
      })

      return true
    },
    [state.operations, state.tableIdMap]
  )

  // 重做操作
  const redo = useCallback(
    (sheetId: number): boolean => {
      // 获取当前表格的操作
      const tableOperations = state.operations.filter((op) => state.tableIdMap[op.id] === sheetId)

      // 检查是否有可重做的操作
      const canRedo = tableOperations.some((op) => op.disabled)

      if (!canRedo) return false

      // 执行重做
      dispatch({
        type: VisTableOperationActionType.REDO,
        sheetId,
      })

      // 记录重做日志
      dispatch({
        type: VisTableOperationActionType.RECORD_LOG,
        payload: {
          type: 'REDO',
          description: '重做操作',
          syncStatus: SyncStatus.SUCCESS,
        },
        sheetId,
      })

      return true
    },
    [state.operations, state.tableIdMap]
  )

  // 清空操作
  const clearOperations = useCallback((sheetId: number) => {
    dispatch({
      type: VisTableOperationActionType.CLEAR_OPERATIONS,
      sheetId,
    })
  }, [])

  const value = {
    state,
    initOperationNo,
    recordOperation,
    undo,
    redo,
    clearOperations,
  }

  return <VisTableOperationContext.Provider value={value}>{children}</VisTableOperationContext.Provider>
}

// 使用上下文的Hook
export const useVisTableOperationContext = () => useContext(VisTableOperationContext)
