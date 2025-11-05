import { ListTable } from '@visactor/vtable'
import { ProgressStatusEnum } from 'gel-api'
import { useCallback, useRef } from 'react'
import { TaskIdentifier, useTableAITask } from '../context'
import { GENERATE_TEXT, PENDING_TEXT } from '@/components/VisTable/config/status'

export interface UseAITaskOperationProps {
  /**
   * 表格实例引用
   */
  multiTableRef: React.MutableRefObject<ListTable | null>
}

/**
 * AI任务操作Hook
 * 用于处理表格中的AI生成内容相关操作
 */
export const useAITaskOperation = ({ multiTableRef }: UseAITaskOperationProps) => {
  // 获取AI任务状态和方法
  const { taskList, taskLog, updateTask } = useTableAITask()

  /**
   * 创建任务ID对象
   */
  const createTaskId = useCallback((columnId: string, rowId: string): TaskIdentifier => {
    return {
      columnId,
      rowId,
    }
  }, [])

  /**
   * 解析任务ID，返回columnId和rowId
   */
  const parseTaskId = useCallback((taskId: TaskIdentifier | string): { columnId: string; rowId: string } => {
    if (typeof taskId === 'string') {
      // 兼容旧版本的字符串格式
      const [columnId, rowId] = taskId.split(',')
      return { columnId, rowId }
    }
    return { columnId: taskId.columnId, rowId: taskId.rowId }
  }, [])

  /**
   * 获取列索引
   */
  const getColumnIndex = useCallback(
    (columnId: string): number => {
      if (!multiTableRef.current) return -1

      // 查找列索引
      const columns = multiTableRef.current.columns || []
      return columns.findIndex((col) => col.field === columnId)
    },
    [multiTableRef]
  )

  /**
   * 获取行索引
   */
  const getRowIndex = useCallback(
    (rowId: string): number => {
      if (!multiTableRef.current) return -1

      // 查找行索引
      const dataSource = multiTableRef.current.dataSource.records || []
      const rowIndex = Array.isArray(dataSource) ? dataSource.findIndex((record) => record.rowId === rowId) : -1

      return rowIndex + 1
    },
    [multiTableRef]
  )

  /**
   * 存储单元格原始内容的Map
   * 键：columnId,rowId，值：原始内容
   */
  const originalContentMap = useRef<Map<string, string>>(new Map())

  /**
   * 存储已更新过内容的单元格Map
   * 键：columnId,rowId，值：是否已更新
   */
  const updatedCellsMap = useRef<Map<string, boolean>>(new Map())

  /**
   * 获取单元格原始内容
   */
  const getOriginalContent = useCallback(
    (columnId: string, rowId: string): string => {
      // 获取Map中存储的原始内容
      const cachedContent = originalContentMap.current.get(`${columnId},${rowId}`)

      // 如果Map中没有存储原始内容，返回空字符串
      return cachedContent || ''
    },
    [multiTableRef, getColumnIndex, getRowIndex]
  )

  /**
   * 检查单元格是否已更新结果
   */
  const isCellUpdated = useCallback((columnId: string, rowId: string): boolean => {
    return !!updatedCellsMap.current.get(`${columnId},${rowId}`)
  }, [])

  /**
   * 标记单元格已更新结果
   */
  const markCellAsUpdated = useCallback((columnId: string, rowId: string) => {
    updatedCellsMap.current.set(`${columnId},${rowId}`, true)
  }, [])

  /**
   * 运行单个单元格的AI任务
   * 修复：防止事件重复注册和移除的问题
   */
  const runCellTask = useCallback(
    (columnId: string, rowId: string, originalContent?: string) => {
      console.log('🚀 ~ runCellTask ~ originalContent:', columnId, rowId, originalContent)
      if (!multiTableRef.current) return

      // 不再使用字符串作为taskId，直接创建TaskIdentifier对象
      const taskId = { columnId, rowId }
      console.log('🚀 ~ useAITaskOperation ~ taskId:', taskId)

      // 获取列、行索引
      const columnIndex = getColumnIndex(columnId) + 1
      const rowIndex = getRowIndex(rowId)

      if (columnIndex < 0 || rowIndex < 0) {
        console.warn('列或行索引无效，无法执行AI任务', { columnId, rowId, columnIndex, rowIndex })
        return
      }

      // 保存原始内容（如果提供）
      if (originalContent) {
        originalContentMap.current.set(`${columnId},${rowId}`, originalContent)
      }

      // 重置单元格更新状态，以便可以接收新的状态更新
      updatedCellsMap.current.delete(`${columnId},${rowId}`)

      // 确保表格实例仍然有效，防止出现事件注册和移除问题
      if (multiTableRef.current) {
        console.log('🚀 更新单元格状态为等待运行:', columnIndex, rowIndex)
        // 更新UI显示为等待状态
        multiTableRef.current.changeCellValue(columnIndex, rowIndex, PENDING_TEXT)

        // 添加到任务队列，传递TaskIdentifier对象和原始内容
        updateTask([taskId])
      }

      return taskId
    },
    [multiTableRef, getColumnIndex, getRowIndex, updateTask]
  )

  /**
   * 运行多个单元格的AI任务
   */
  const runMultipleCellTasks = useCallback(
    (cells: Array<{ columnId: string; rowId: string }>) => {
      if (!multiTableRef.current || cells.length === 0) return []

      const taskIds: TaskIdentifier[] = []
      const originalContents: Record<string, string> = {}

      cells.forEach(({ columnId, rowId }) => {
        const columnIndex = getColumnIndex(columnId)
        const rowIndex = getRowIndex(rowId)

        if (columnIndex < 0 || rowIndex < 0) return

        // 获取并保存原始内容
        const currentContent = multiTableRef.current?.getCellValue(columnIndex, rowIndex)
        const originalContent = currentContent || ''

        // 存储原始内容，用于传递给API
        originalContents[`${columnId},${rowId}`] = originalContent

        // 重置单元格更新状态
        updatedCellsMap.current.delete(`${columnId},${rowId}`)

        // 创建任务标识符对象
        taskIds.push({
          columnId,
          rowId,
          originalContent,
        })

        // 更新UI显示为等待状态
        if (multiTableRef.current) {
          multiTableRef.current.changeCellValue(columnIndex, rowIndex, PENDING_TEXT)
        }
      })

      // 添加到任务队列，并传递原始内容
      if (taskIds.length > 0) {
        updateTask(taskIds)
      }

      return taskIds
    },
    [multiTableRef, getColumnIndex, getRowIndex, updateTask]
  )

  /**
   * 运行整列的AI任务
   */
  const runColumnTask = useCallback(() => {
    // 此方法当前未实现完整逻辑
    console.log('runColumnTask方法尚未实现完整逻辑')
  }, [])

  /**
   * 更新单元格内容（当任务状态变化时）
   */
  const updateCellContent = useCallback(
    (taskId: TaskIdentifier | string, content: string) => {
      if (!multiTableRef.current) return

      const { columnId, rowId } = parseTaskId(taskId)
      const columnIndex = getColumnIndex(columnId)
      const rowIndex = getRowIndex(rowId)

      if (columnIndex >= 0 && rowIndex >= 0) {
        multiTableRef.current.changeCellValue(columnIndex, rowIndex, content)
      }
    },
    [multiTableRef, parseTaskId, getColumnIndex, getRowIndex]
  )

  /**
   * 检查单元格内容并更新（基于当前任务状态）
   * 建议在UI组件的useEffect中调用
   */
  const checkAndUpdateCells = useCallback(() => {
    if (!multiTableRef.current) return

    // 遍历所有任务和日志
    const allTasks = [
      ...taskList,
      ...taskLog.flatMap((logItem) => {
        // 只处理不在活动任务列表中的日志项
        if (taskList.some((task) => task.columnId === logItem.columnId && task.rowId === logItem.rowId)) {
          return []
        }
        // 返回日志中最新的历史记录
        const lastHistory = logItem.history[logItem.history.length - 1]
        return [
          {
            columnId: logItem.columnId,
            rowId: logItem.rowId,
            status: lastHistory.status,
            content: lastHistory.content,
            timestamp: lastHistory.timestamp,
          },
        ]
      }),
    ]
    allTasks.forEach((task) => {
      const { columnId, rowId, status, content, processedValue } = task
      const columnIndex = getColumnIndex(columnId) + 1
      const rowIndex = getRowIndex(rowId)

      if (columnIndex < 0 || rowIndex < 0) return

      // 检查是否已经更新过此单元格
      const isAlreadyUpdated = isCellUpdated(columnId, rowId)
      const currentValue = multiTableRef.current?.getCellValue(columnIndex, rowIndex)
      const originalContent = getOriginalContent(columnId, rowId)

      // 只有未更新过的单元格或处于中间状态的单元格才需要更新
      const needsUpdate = !isAlreadyUpdated || currentValue === PENDING_TEXT || currentValue === GENERATE_TEXT

      if (needsUpdate && multiTableRef.current) {
        switch (status) {
          case ProgressStatusEnum.PENDING:
            if (currentValue !== PENDING_TEXT) {
              multiTableRef.current.changeCellValue(columnIndex, rowIndex, PENDING_TEXT)
            }
            break

          case ProgressStatusEnum.RUNNING:
            if (currentValue === PENDING_TEXT || !currentValue?.includes('...')) {
              multiTableRef.current.changeCellValue(columnIndex, rowIndex, '生成中...')
            }
            break

          case ProgressStatusEnum.SUCCESS:
            // 成功时使用服务端返回的内容

            console.log('成功生成内容', { columnIndex, rowIndex, content })
            multiTableRef.current.changeCellValue(columnIndex, rowIndex, content)
            markCellAsUpdated(columnId, rowId)

            break

          case ProgressStatusEnum.FAILED:
            // 失败时恢复原始内容
            console.log('任务失败，恢复原始内容', { columnId, rowId, originalContent })
            multiTableRef.current.changeCellValue(
              columnIndex,
              rowIndex,
              originalContent ? originalContent : '[生成失败] 请重试'
            )
            markCellAsUpdated(columnId, rowId)
            break
        }
      }
    })
  }, [
    multiTableRef,
    taskList,
    taskLog,
    getColumnIndex,
    getRowIndex,
    getOriginalContent,
    isCellUpdated,
    markCellAsUpdated,
  ])

  /**
   * 获取任务统计信息
   * 返回总任务数、成功数、失败数、进行中数量
   */
  const getTaskStats = useCallback(() => {
    const total = taskLog.length
    const success = taskLog.filter((task) => task.latestStatus === ProgressStatusEnum.SUCCESS).length
    const failed = taskLog.filter((task) => task.latestStatus === ProgressStatusEnum.FAILED).length
    const inProgress = taskList.length

    return {
      total,
      success,
      failed,
      inProgress,
    }
  }, [taskLog, taskList])

  return {
    taskList,
    taskLog,
    createTaskId,
    parseTaskId,
    runCellTask,
    runMultipleCellTasks,
    runColumnTask,
    updateCellContent,
    checkAndUpdateCells,
    getTaskStats,
    getOriginalContent,
  }
}
