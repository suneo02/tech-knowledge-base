import { useCallback, useRef, useEffect } from 'react'
import { useTableActions } from './useTableActions'
import { useVisTableOperationState } from './useVisTableOperationState'
import {
  DeleteRecordsOperation,
  RenameColumnOperation,
  toggleDisplayColumnOperation,
  VisTableOperationType,
} from '../types/operationTypes'
import { CellMetadata, Column, ProgressStatusEnum } from 'gel-api'
import { SortState } from '@visactor/vtable/es/ts-types'
import { GENERATE_TEXT, PENDING_TEXT } from '../config/status'

import { useVisTableOperationContext } from '../context/VisTableOperationContext'
import { tableOperationService } from '../services/tableOperationService'
import { useTableAITask } from '@/components/MultiTable/context'
import { generateUniqueName } from '@/utils/common/data'

/**
 * 包装表格操作的选项接口
 */
export interface WithTableHistoryOptions {
  sheetId: number
  enableUndoRedo?: boolean
}

/**
 * 表格操作方法的增强自定义 Hook，添加操作日志功能
 * @param options 选项配置
 * @returns 增强后的表格操作方法
 */
export const useTableHistoryActions = (options: WithTableHistoryOptions) => {
  const { sheetId, enableUndoRedo = true } = options

  // 本地操作编号，确保递增
  const localOperationNoRef = useRef<number>(0)

  // 获取基础表格操作方法
  const baseActions = useTableActions()

  // 获取AI任务状态和操作
  const { taskList } = useTableAITask()

  // 获取操作状态管理
  const {
    recordOperation,
    undo: undoOperation,
    redo: redoOperation,
    canUndo,
    canRedo,
  } = useVisTableOperationState(sheetId)

  // 获取操作上下文以获取最新的 operationNo
  const { state } = useVisTableOperationContext()

  // 当操作编号在上下文中更新时，同步到本地引用
  useEffect(() => {
    if (state.operationNo > localOperationNoRef.current) {
      localOperationNoRef.current = state.operationNo
    }
  }, [state.operationNo])

  // 监控任务状态变化，自动更新表格单元格内容
  // 当AI任务状态变化时，根据不同状态更新单元格内容
  useEffect(() => {
    // 处理所有需要更新显示的任务（运行中、成功、失败）
    const tasksToUpdate = taskList.filter(
      (task) =>
        task.status === ProgressStatusEnum.RUNNING ||
        task.status === ProgressStatusEnum.SUCCESS ||
        task.status === ProgressStatusEnum.FAILED
    )

    if (tasksToUpdate.length > 0) {
      // 处理每个需要更新的任务
      tasksToUpdate.forEach((task) => {
        // 查找单元格位置
        const table = baseActions.getTableInstance()
        if (!table) return

        // 通过列标识和行标识找到对应的单元格位置
        const allColumns = table.columns || []
        const colIndex = allColumns.findIndex((col) => col.field === task.columnId)
        if (colIndex < 0) return

        // 行索引需要从表格数据中查找
        const dataSource = table.dataSource.records || []
        const rowIndex = Array.isArray(dataSource) ? dataSource.findIndex((record) => record.rowId === task.rowId) : -1

        if (rowIndex >= 0) {
          // 根据任务状态更新单元格内容
          if (task.status === ProgressStatusEnum.RUNNING) {
            // 运行中状态，显示GENERATE_TEXT
            baseActions.setCellValue(colIndex + 1, rowIndex + 1, GENERATE_TEXT)
          } else if (task.status === ProgressStatusEnum.SUCCESS) {
            // 成功状态，显示生成的内容
            baseActions.setCellValue(colIndex + 1, rowIndex + 1, task.content || '--')
          } else if (task.status === ProgressStatusEnum.FAILED) {
            // 失败状态，显示错误信息
            console.log('🚀 ~ task:', task)
            const errorMessage = task.processedValue || '生成失败，请重试'
            baseActions.setCellValue(colIndex + 1, rowIndex + 1, errorMessage)
          }
        }
      })
    }
  }, [taskList, baseActions])

  // 包装 setCellValue 方法
  const setCellValue = useCallback(
    (payload: {
      col: number
      row: number
      changedValue: string | number
      rawValue?: string | number
      currentValue?: string | number
      noRecord?: boolean
      meta?: CellMetadata
    }) => {
      // 记录操作日志
      console.log('setCellValue', payload)
      if (
        payload.noRecord ||
        payload.changedValue === PENDING_TEXT ||
        payload.changedValue === GENERATE_TEXT ||
        payload.currentValue === PENDING_TEXT ||
        payload.currentValue === GENERATE_TEXT
      )
        return
      recordOperation(
        {
          type: VisTableOperationType.SET_CELL_VALUE,
          timestamp: new Date().toISOString(),
          payload,
          syncStatus: 'PENDING',
        },
        async (_, sheetId) => {
          try {
            // 增加本地操作编号
            localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
            const nextOperationNo = localOperationNoRef.current
            const meta = payload?.meta
            if (meta) {
              await tableOperationService.updateCell({
                columnId: meta.columnId,
                rowId: meta.rowId,
                value: payload.changedValue,
                sheetId,
                operationNo: nextOperationNo,
              })
            }
          } catch (error) {
            console.error('同步添加列操作失败:', error)
            throw error
          }
        }
      )
    },
    [baseActions, recordOperation]
  )

  // 包装 addColumn 方法
  const addColumn = useCallback(
    (col: number, column?: Column, last?: boolean) => {
      // 执行原始操作
      const result = baseActions.addColumn(col, column)

      // 记录操作日志
      if (result) {
        setTimeout(() => {
          const table = baseActions.getTableInstance()
          if (table) {
            table.selectCell(col + 1, 0)
            if (last) {
              table.scrollToCol(col + 1)
            }
          }
        }, 200)
        recordOperation(
          {
            type: VisTableOperationType.COLUMN_ADD,
            timestamp: new Date().toISOString(),
            payload: {
              col,
              column: result,
            },
            syncStatus: 'PENDING',
          },
          async (operation, sheetId) => {
            // 调用 excel/operation 接口同步添加列操作
            try {
              // 增加本地操作编号
              localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
              const nextOperationNo = localOperationNoRef.current
              await tableOperationService.addColumn({
                sheetId,
                column: result,
                columnIndex: col + 1,
                operationNo: nextOperationNo,
                columnId: result.columnId,
              })
            } catch (error) {
              console.error('同步添加列操作失败:', error)
              throw error
            }
          }
        )
      }

      return result
    },
    [baseActions, recordOperation, sheetId]
  )

  // 删除列
  const deleteColumn = useCallback(
    (col: number, column?: Column) => {
      // 执行原始操作
      const result = baseActions.deleteColumn(col)

      // 记录操作日志
      if (result) {
        recordOperation(
          {
            type: VisTableOperationType.COLUMN_DELETE,
            timestamp: new Date().toISOString(),
            payload: {
              col,
              column,
            },
            syncStatus: 'PENDING',
          },
          async (_, sheetId) => {
            // 调用 excel/operation 接口同步添加列操作
            try {
              // 增加本地操作编号
              localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
              const nextOperationNo = localOperationNoRef.current
              await tableOperationService.deleteColumn({
                sheetId,
                columnId: column.field,
                operationNo: nextOperationNo,
              })
            } catch (error) {
              console.error('同步添加列操作失败:', error)
              throw error
            }
          }
        )
      }

      return result
    },
    [baseActions, recordOperation, sheetId]
  )

  // 移动列
  const moveColumn = useCallback(
    (payload: { fromCol: number; toCol: number; columnId: string; title: string }) => {
      // 记录操作日志
      console.log('setCellValue', payload)
      recordOperation(
        {
          type: VisTableOperationType.COLUMN_MOVE,
          timestamp: new Date().toISOString(),
          payload,
          syncStatus: 'PENDING',
        },
        async (_, sheetId) => {
          try {
            // 增加本地操作编号
            localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
            const nextOperationNo = localOperationNoRef.current

            await tableOperationService.moveColumn({
              columnId: payload.columnId,
              col: payload.toCol - 1,
              sheetId,
              operationNo: nextOperationNo,
            })
          } catch (error) {
            console.error('同步添加列操作失败:', error)
            throw error
          }
        }
      )
    },
    [baseActions, recordOperation]
  )

  // 重命名
  const renameColumn = useCallback(
    (payload: RenameColumnOperation['payload']) => {
      // 记录操作日志
      recordOperation(
        {
          type: VisTableOperationType.COLUMN_RENAME,
          timestamp: new Date().toISOString(),
          payload,
          syncStatus: 'PENDING',
        },
        async (_, sheetId) => {
          try {
            // 增加本地操作编号
            localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
            const nextOperationNo = localOperationNoRef.current

            await tableOperationService.updateColumn({
              columnId: payload.columnId,
              newColumnName: payload.changedValue,
              sheetId,
              operationNo: nextOperationNo,
            })
          } catch (error) {
            console.error('同步添加列操作失败:', error)
            throw error
          }
        }
      )
    },
    [baseActions, recordOperation]
  )

  // 隐藏展示列
  const toggleDisplayColumn = useCallback(
    (payload: toggleDisplayColumnOperation['payload']) => {
      // 记录操作日志
      recordOperation(
        {
          type: VisTableOperationType.COLUMN_TOGGLE_DISPLAY,
          timestamp: new Date().toISOString(),
          payload,
          syncStatus: 'PENDING',
        },
        async (_, sheetId) => {
          try {
            // 增加本地操作编号
            localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
            const nextOperationNo = localOperationNoRef.current

            await tableOperationService.updateColumn({
              columnId: payload.columnId,
              isHidden: payload.isHidden,
              sheetId,
              operationNo: nextOperationNo,
            })
          } catch (error) {
            console.error('同步添加列操作失败:', error)
            throw error
          }
        }
      )
    },
    [baseActions, recordOperation]
  )

  // 包装 deleteRecords 方法
  const deleteRecords = useCallback(
    (payload: DeleteRecordsOperation['payload']) => {
      // 执行原始操作
      const result = baseActions.deleteRecords(payload.map((res) => res.row - 1))

      // 记录操作日志
      if (result) {
        recordOperation(
          {
            type: VisTableOperationType.DELETE_RECORDS,
            timestamp: new Date().toISOString(),
            payload,
            syncStatus: 'PENDING',
          },
          async (_, sheetId) => {
            try {
              // 增加本地操作编号
              localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
              const nextOperationNo = localOperationNoRef.current

              await tableOperationService.deleteRow({ rowId: payload[0].rowId, sheetId, operationNo: nextOperationNo })
            } catch (error) {
              console.error('删除行操作失败:', error)
              throw error
            }
          }
        )
      }

      return result
    },
    [baseActions, recordOperation]
  )

  // 包装 setRecords 方法
  const setRecords = useCallback(
    <T extends Record<string, unknown>>(records: T[], option?: { sortState?: SortState | SortState[] | null }) => {
      // 执行原始操作
      const result = baseActions.setRecords(records, option)

      // 记录操作日志
      if (result) {
        recordOperation({
          type: VisTableOperationType.SET_RECORDS,
          timestamp: new Date().toISOString(),
          payload: {
            records,
            originalRecords: [],
            sortState: option?.sortState,
          },
          syncStatus: 'PENDING',
        })
      }

      return result
    },
    [baseActions, recordOperation]
  )

  // 包装 addRecord 方法
  const addRecord = useCallback(
    (recordIndex?: number) => {
      // 执行原始操作
      const record = baseActions.addRecord(recordIndex)

      // 记录操作日志
      if (record) {
        recordOperation(
          {
            type: VisTableOperationType.RECORD_ADD,
            timestamp: new Date().toISOString(),
            payload: {
              record,
              index: recordIndex || 0,
            },
            syncStatus: 'PENDING',
          },
          async (_, sheetId) => {
            try {
              // 增加本地操作编号
              localOperationNoRef.current = Math.max(localOperationNoRef.current, state.operationNo) + 1
              const nextOperationNo = localOperationNoRef.current

              // 调用服务添加行
              await tableOperationService.addRecord({
                sheetId,
                rowId: record.rowId as string,
                rowIndex: recordIndex + 1,
                operationNo: nextOperationNo,
              })
            } catch (error) {
              console.error('同步添加行操作失败:', error)
              throw error
            }
          }
        )
      }

      return record
    },
    [baseActions, recordOperation, state.operationNo]
  )

  /**
   * 运行单元格中的AI任务
   * @param col 列索引
   * @param row 行索引
   * @returns 是否成功触发任务
   *
   * 工作流程：
   * 1. 调用基础的runCell方法触发AI任务
   * 2. 记录操作到历史记录中
   * 3. 通过useEffect监听任务状态变化
   * 4. 根据不同任务状态更新单元格内容:
   *    - RUNNING: 显示GENERATE_TEXT
   *    - SUCCESS: 显示生成的内容
   *    - FAILED: 显示错误信息
   */
  const runCell = useCallback(
    (col: number, row: number) => {
      console.log('runCell', col, row)

      // 执行原始操作
      const result = baseActions.runCell(col, row)

      // 记录操作日志
      if (result) {
        recordOperation({
          type: VisTableOperationType.CELL_RUN,
          timestamp: new Date().toISOString(),
          payload: {
            col,
            row,
          },
          syncStatus: 'PENDING',
        })
      }

      return result
    },
    [baseActions, recordOperation]
  )

  // 运行多行
  const runColumn = useCallback(
    (props: { col?: number; columnId?: string }) => {
      const result = baseActions.runColumn(props)
      return result
      // 记录操作日志
      // if (result) {
      //   recordOperation({
      //     type: VisTableOperationType.CELL_RUN,
      //     timestamp: new Date().toISOString(),
      //   })
      // }
      // return result
    },
    [baseActions, recordOperation]
  )

  // 撤销操作
  const undo = useCallback(() => {
    if (enableUndoRedo && canUndo) {
      undoOperation()
      return true
    }
    return false
  }, [enableUndoRedo, canUndo, undoOperation])

  // 重做操作
  const redo = useCallback(() => {
    if (enableUndoRedo && canRedo) {
      redoOperation()
      return true
    }
    return false
  }, [enableUndoRedo, canRedo, redoOperation])

  // 返回增强后的方法
  return {
    ...baseActions,
    setCellValue,
    addColumn,
    deleteRecords,
    setRecords,
    addRecord,
    undo,
    redo,
    runCell,
    runColumn,
    deleteColumn,
    moveColumn,
    renameColumn,
    toggleDisplayColumn,
    canUndo: enableUndoRedo && canUndo,
    canRedo: enableUndoRedo && canRedo,
  }
}
