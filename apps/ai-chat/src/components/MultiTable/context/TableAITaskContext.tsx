import { requestToSuperlistFcs, requestToWFCSuperlistFcs } from '@/api'
import { ProgressStatusEnum } from 'gel-api'
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// 任务标识接口，包含列ID和行ID以及可选的原始内容
export interface TaskIdentifier {
  columnId: string
  rowId: string
  originalContent?: string
  status?: ProgressStatusEnum
  errorMessage?: string
}

// 任务状态映射表类型
export interface TaskStatusItem {
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  timestamp?: number // 添加时间戳，方便排序和统计
  content?: string // 添加内容字段，存储AI生成的内容或错误消息
  originalContent?: string // 添加原始内容字段
  cellId?: string // 添加cellId字段，用于后续轮询
  processedValue?: string // 添加processedValue字段，用于存储AI生成的内容或错误消息
  sourceId?: string // 添加sourceId字段，用于存储AI生成的内容或错误消息
}

// 任务历史记录接口 - 用于记录任务的完整历史
export interface TaskHistoryLog {
  columnId: string
  rowId: string
  history: TaskStatusItem[] // 任务的历史状态记录
  latestStatus: ProgressStatusEnum // 最新状态
  latestTimestamp?: number
  originalContent?: string // 添加原始内容字段
  cellId?: string // 添加cellId字段
}

// 更新任务选项接口
// interface UpdateTaskOptions {
//   originalContent?: string
//   originalContents?: Record<string, string> // 按columnId,rowId键索引的原始内容
// }

// AI任务上下文状态接口
export interface TableAITaskState {
  // 任务状态映射表 - 只包含进行中的任务
  taskList: TaskStatusItem[]
  // 任务日志表 - 记录每个单元格的所有历史操作
  taskLog: TaskHistoryLog[]
  // 是否正在进行轮询
  isPolling: boolean
  // 更新任务列表并开始或继续轮询
  updateTask: (list: TaskIdentifier[]) => void
  // 从已有状态初始化任务，不触发runCell API
  initTasksFromStatus: (list: TaskIdentifier[]) => void
  // 获取任务状态
  getTaskStatus: (taskId: TaskIdentifier) => ProgressStatusEnum | undefined
  // 重置任务状态
  resetTask: (taskId: TaskIdentifier) => void
  // 重置所有任务
  resetAllTasks: () => void
}

// 获取cell的初始状态，调用runCell接口获取cellId
const initCellStatus = async (taskId: TaskIdentifier, sheetId: number): Promise<TaskStatusItem> => {
  const { columnId, rowId } = taskId

  try {
    const res = await requestToSuperlistFcs('excel/runCell', {
      columnId,
      rowId,
      sheetId,
    })

    // 提取API响应数据
    const cellId = res.result?.cellId
    const status = res.result?.status || ProgressStatusEnum.PENDING

    return {
      columnId,
      rowId,
      status,
      cellId,
      timestamp: Date.now(),
      originalContent: taskId.originalContent,
      processedValue: res.result.processedValue,
      sourceId: res.result.sourceId,
    }
  } catch (error) {
    console.error(`单元格runCell API调用失败(${columnId},${rowId}):`, error)
    return {
      columnId,
      rowId,
      status: ProgressStatusEnum.FAILED,
      timestamp: Date.now(),
      originalContent: taskId.originalContent,
    }
  }
}

// 从已有状态初始化任务列表，不调用runCell接口
const initTasksFromExistingStatus = (taskItems: TaskIdentifier[]): TaskStatusItem[] => {
  return taskItems.map((taskItem) => ({
    columnId: taskItem.columnId,
    rowId: taskItem.rowId,
    status: taskItem.status || ProgressStatusEnum.PENDING,
    timestamp: Date.now(),
    originalContent: taskItem.originalContent,
    cellId: undefined, // 初始化时不设置cellId，等待轮询时从API获取
  }))
}

// 获取任务状态，调用getCellsStatus接口轮询状态
const fetchTaskStatus = async (taskItems: TaskStatusItem[], sheetId: number): Promise<TaskStatusItem[]> => {
  try {
    // 提取有cellId的任务
    const tasksWithCellId = taskItems.filter((task) => task.cellId)

    if (tasksWithCellId.length === 0) {
      return taskItems
    }

    // 准备调用getCellsStatus接口的参数
    const cellIds = tasksWithCellId.map((task) => task.cellId as string)

    const res = await requestToWFCSuperlistFcs('superlist/excel/getCellsStatus', {
      cellIds,
      sheetId,
    })

    // 安全地提取API响应数据
    const cellStatusList = Array.isArray(res.Data?.data) ? res.Data.data : []

    // 更新任务状态
    return taskItems.map((task) => {
      // 如果没有cellId，保持原状态
      if (!task.cellId) return task

      // 查找对应的状态
      const cellStatus = cellStatusList.find((cell) => cell.cellId === task.cellId)

      if (cellStatus) {
        return {
          ...task,
          status: cellStatus.status,
          content: cellStatus.processedValue,
          timestamp: Date.now(),
        }
      }

      // 如果没有找到对应的状态，保持原状态
      return task
    })
  } catch (error) {
    console.error('轮询任务状态出错:', error)
    return taskItems.map((task) => ({
      ...task,
      status: ProgressStatusEnum.FAILED,
      timestamp: Date.now(),
    }))
  }
}

// 创建上下文
const TableAITaskContext = createContext<TableAITaskState | null>(null)

// Provider 组件
export const TableAITaskProvider: React.FC<{ children: ReactNode; sheetId: number }> = ({ children, sheetId }) => {
  // 任务状态列表 - 只包含进行中的任务
  const [taskList, setTaskList] = useState<TaskStatusItem[]>([])
  // 任务日志 - 记录所有任务历史，包含完整的状态变化记录
  const [taskLog, setTaskLog] = useState<TaskHistoryLog[]>([])
  // 轮询标志
  const [isPolling, setIsPolling] = useState(false)
  // 轮询间隔时间（毫秒）
  const POLLING_INTERVAL = 5000
  // 轮询定时器引用
  const pollingTimerRef = useRef<number | null>(null)

  // const { state } = useTableOperationContext()

  // 更新任务日志，保留任务的所有状态变更历史
  const updateTaskLog = useCallback((newTasks: TaskStatusItem[]) => {
    setTaskLog((prevLog) => {
      // 创建新日志
      const updatedLog = [...prevLog]

      // 遍历新任务
      newTasks.forEach((newTask) => {
        // 查找是否已存在该单元格的记录
        const existingIndex = updatedLog.findIndex(
          (log) => log.columnId === newTask.columnId && log.rowId === newTask.rowId
        )

        if (existingIndex >= 0) {
          // 检查状态是否变化，避免添加重复的状态记录
          const existingLog = updatedLog[existingIndex]
          const lastHistoryItem = existingLog.history[existingLog.history.length - 1]

          // 只有状态发生变化才添加新的历史记录
          if (lastHistoryItem.status !== newTask.status) {
            // 添加新的历史记录
            updatedLog[existingIndex] = {
              ...existingLog,
              history: [
                ...existingLog.history,
                {
                  ...newTask,
                  timestamp: newTask.timestamp || Date.now(),
                },
              ],
              latestStatus: newTask.status,
              latestTimestamp: newTask.timestamp || Date.now(),
              // 如果存在原始内容，保留原始内容
              originalContent: existingLog.originalContent || newTask.originalContent,
              // 保存cellId
              cellId: newTask.cellId || existingLog.cellId,
            }
          }
          // 如果状态相同但内容或时间戳有更新，更新最后一条记录
          else if (newTask.content || newTask.timestamp || newTask.cellId) {
            const updatedHistory = [...existingLog.history]
            updatedHistory[updatedHistory.length - 1] = {
              ...updatedHistory[updatedHistory.length - 1],
              content: newTask.content || updatedHistory[updatedHistory.length - 1].content,
              timestamp: newTask.timestamp || updatedHistory[updatedHistory.length - 1].timestamp,
              cellId: newTask.cellId || updatedHistory[updatedHistory.length - 1].cellId,
            }

            updatedLog[existingIndex] = {
              ...existingLog,
              history: updatedHistory,
              latestTimestamp: newTask.timestamp || existingLog.latestTimestamp,
              // 如果存在原始内容，保留原始内容
              originalContent: existingLog.originalContent || newTask.originalContent,
              // 更新cellId
              cellId: newTask.cellId || existingLog.cellId,
            }
          }
        } else {
          // 创建新记录
          updatedLog.push({
            columnId: newTask.columnId,
            rowId: newTask.rowId,
            history: [
              {
                ...newTask,
                timestamp: newTask.timestamp || Date.now(),
              },
            ],
            latestStatus: newTask.status,
            latestTimestamp: newTask.timestamp || Date.now(),
            originalContent: newTask.originalContent, // 保存原始内容
            cellId: newTask.cellId, // 保存cellId
          })
        }
      })

      return updatedLog
    })
  }, [])

  // 停止轮询
  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      clearTimeout(pollingTimerRef.current)
      pollingTimerRef.current = null
    }
    setIsPolling(false)
  }, [])

  // 轮询函数 - 提取为单独的函数，避免闭包问题
  const poll = useCallback(async () => {
    // 获取最新的taskList
    setTaskList((currentTaskList) => {
      // 如果任务列表为空，停止轮询
      console.log('🚀 ~ poll ~ currentTaskList:', currentTaskList)
      const _taskList = currentTaskList.filter(
        (res) => res.status !== ProgressStatusEnum.SUCCESS && res.status !== ProgressStatusEnum.FAILED
      )
      if (!_taskList.length) {
        stopPolling()
        return currentTaskList
      }

      // 异步获取任务状态
      fetchTaskStatus(_taskList, sheetId)
        .then((taskStatusList) => {
          console.log('🚀 ~ poll ~ taskStatusList:', taskStatusList)
          // 更新任务状态
          setTaskList((prevList) => {
            const updatedTasks: TaskStatusItem[] = []
            const completedTasks: TaskStatusItem[] = []

            prevList.forEach((item) => {
              const taskStatus = taskStatusList.find(
                (status) => status.columnId === item.columnId && status.rowId === item.rowId
              )

              if (taskStatus) {
                // 添加当前任务状态到日志中
                completedTasks.push({
                  ...item,
                  status: taskStatus.status,
                  content: taskStatus.content,
                  timestamp: Date.now(),
                  cellId: taskStatus.cellId || item.cellId,
                })

                // 只有进行中的任务才保留在活动列表中
                if (
                  taskStatus.status !== ProgressStatusEnum.SUCCESS &&
                  taskStatus.status !== ProgressStatusEnum.FAILED
                ) {
                  updatedTasks.push({
                    ...item,
                    status: taskStatus.status,
                    content: taskStatus.content,
                    cellId: taskStatus.cellId || item.cellId,
                  })
                }
                // 成功或失败的任务在UI更新后才会被移除
                // 通过保持任务在taskList中一个轮询周期，确保UI有足够时间更新
                else {
                  // 通过taskStatus中间状态标记为即将移除，但还保留在列表中
                  updatedTasks.push({
                    ...item,
                    status: taskStatus.status,
                    content: taskStatus.content,
                    cellId: taskStatus.cellId || item.cellId,
                    // 标记任务已处理，下一轮询会移除
                    timestamp: Date.now(),
                  })
                }
              } else {
                // 如果没有找到对应的任务状态，保留原状态
                updatedTasks.push(item)
              }
            })

            // 将任务更新到日志
            if (completedTasks.length > 0) {
              updateTaskLog(completedTasks)
            }

            // 如果所有任务都已完成，停止轮询
            if (updatedTasks.length === 0) {
              console.log('所有任务已完成，停止轮询')
              stopPolling()
            } else {
              // 设置下一次轮询
              pollingTimerRef.current = setTimeout(poll, POLLING_INTERVAL)
            }

            return updatedTasks
          })
        })
        .catch((error) => {
          console.error('轮询任务状态失败:', error)
          // 出错时继续轮询
          pollingTimerRef.current = setTimeout(poll, POLLING_INTERVAL)
        })

      return currentTaskList
    })
  }, [stopPolling, updateTaskLog, sheetId])

  // 开始轮询
  const startPolling = useCallback(() => {
    if (isPolling) return

    setIsPolling(true)
    // 开始首次轮询
    poll()
  }, [isPolling, poll])

  // 组件卸载时清理轮询
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current)
      }
    }
  }, [])

  // 更新任务列表
  const updateTask = useCallback(
    async (list: TaskIdentifier[]) => {
      if (!list || list.length === 0) return

      let initialTaskItems: TaskStatusItem[] = []

      // 根据任务数量选择不同的处理方式
      if (list.length === 1) {
        // 单个任务，使用runCell接口
        const taskItem = await initCellStatus(list[0], sheetId)
        initialTaskItems = [taskItem]
      } else {
        // 多个任务，调用excel/runColumns接口
        // 首先检查所有任务是否属于同一列
        const columnId = list[0].columnId
        const allSameColumn = list.every((task) => task.columnId === columnId)

        if (allSameColumn) {
          // 如果都是同一列，直接调用runColumns接口
          try {
            // 调用runColumns接口，暂不使用返回值中的cellId
            const { result } = await requestToSuperlistFcs('excel/runColumn', {
              columnId,
              sheetId,
            })
            if (result.data.length) {
              // 按照单个任务的结构，构建任务列表，设置为PENDING状态等待轮询
              initialTaskItems = result.data.map((task) => ({
                cellId: task.cellId,
                columnId: task.columnId,
                rowId: task.rowId,
                status: ProgressStatusEnum.PENDING,
                timestamp: Date.now(),
                originalContent: task.processedValue,
              }))
            }
          } catch (error) {
            console.error(`调用runColumn API失败(${columnId}):`, error)
            // 失败时设置所有任务为失败状态
            initialTaskItems = list.map((task) => ({
              columnId: task.columnId,
              rowId: task.rowId,
              status: ProgressStatusEnum.FAILED,
              timestamp: Date.now(),
              originalContent: task.originalContent,
            }))
          }
        } else {
          // 如果不是同一列，按列分组后分别调用runColumns
          console.log(`任务属于多个列，按列分组后调用runColumns接口`)
          // 按列分组
          const tasksByColumn: Record<string, TaskIdentifier[]> = {}
          list.forEach((task) => {
            if (!tasksByColumn[task.columnId]) {
              tasksByColumn[task.columnId] = []
            }
            tasksByColumn[task.columnId].push(task)
          })

          // 对每个列分别调用runColumns
          const columnResults = await Promise.all(
            Object.entries(tasksByColumn).map(async ([colId, tasks]) => {
              try {
                // 调用runColumns接口，暂不使用返回值中的cellId
                await requestToSuperlistFcs('excel/runColumn', {
                  columnId: colId,
                  sheetId,
                })

                // 返回该列的所有任务，设置为PENDING状态等待轮询
                return tasks.map((task) => ({
                  columnId: task.columnId,
                  rowId: task.rowId,
                  status: ProgressStatusEnum.PENDING,
                  timestamp: Date.now(),
                  originalContent: task.originalContent,
                }))
              } catch (error) {
                console.error(`调用runColumn API失败(${colId}):`, error)
                // 失败时设置该列所有任务为失败状态
                return tasks.map((task) => ({
                  columnId: task.columnId,
                  rowId: task.rowId,
                  status: ProgressStatusEnum.FAILED,
                  timestamp: Date.now(),
                  originalContent: task.originalContent,
                }))
              }
            })
          )

          // 合并所有列的结果
          initialTaskItems = columnResults.flat()
        }
      }

      // 更新日志
      updateTaskLog(initialTaskItems)

      setTaskList((prevList) => {
        // 创建新数组
        const newTasks = [...prevList]

        // 添加新任务
        initialTaskItems.forEach((taskItem) => {
          const { columnId, rowId, cellId, status } = taskItem

          // 检查任务是否已存在
          const existingTaskIndex = newTasks.findIndex((task) => task.columnId === columnId && task.rowId === rowId)

          // 如果任务不存在或不是成功/失败状态，添加或更新
          if (existingTaskIndex === -1) {
            // 新增任务
            newTasks.push(taskItem)
          } else if (
            newTasks[existingTaskIndex].status !== ProgressStatusEnum.SUCCESS &&
            newTasks[existingTaskIndex].status !== ProgressStatusEnum.FAILED
          ) {
            // 更新现有任务状态
            newTasks[existingTaskIndex].status = status
            // 更新时间戳
            newTasks[existingTaskIndex].timestamp = Date.now()
            // 更新cellId
            if (cellId) {
              newTasks[existingTaskIndex].cellId = cellId
            }
            // 更新原始内容
            if (taskItem.originalContent) {
              newTasks[existingTaskIndex].originalContent = taskItem.originalContent
            }
          }
        })

        return newTasks
      })

      // 如果没有在轮询，开始轮询
      if (!isPolling) {
        // 使用setTimeout确保状态更新后再开始轮询
        setTimeout(() => {
          startPolling()
        }, 0)
      }
    },
    [isPolling, startPolling, updateTaskLog, sheetId]
  )

  // 从已有状态初始化任务，不触发API调用
  const initTasksFromStatus = useCallback(
    (list: TaskIdentifier[]) => {
      if (!list || list.length === 0) return

      // 从已有状态初始化任务项
      const initialTaskItems = initTasksFromExistingStatus(list)

      // 更新日志
      updateTaskLog(initialTaskItems)

      setTaskList((prevList) => {
        // 创建新数组
        const newTasks = [...prevList]

        // 添加新任务
        initialTaskItems.forEach((taskItem) => {
          const { columnId, rowId, status } = taskItem

          // 检查任务是否已存在
          const existingTaskIndex = newTasks.findIndex((task) => task.columnId === columnId && task.rowId === rowId)

          // 如果任务不存在或不是成功/失败状态，添加或更新
          if (existingTaskIndex === -1) {
            // 新增任务
            newTasks.push(taskItem)
          } else if (
            newTasks[existingTaskIndex].status !== ProgressStatusEnum.SUCCESS &&
            newTasks[existingTaskIndex].status !== ProgressStatusEnum.FAILED
          ) {
            // 更新现有任务状态
            newTasks[existingTaskIndex].status = status
            // 更新时间戳
            newTasks[existingTaskIndex].timestamp = Date.now()
            // 更新原始内容
            if (taskItem.originalContent) {
              newTasks[existingTaskIndex].originalContent = taskItem.originalContent
            }
          }
        })

        console.log('初始化任务列表(不触发API):', newTasks)
        return newTasks
      })

      // 如果没有在轮询，开始轮询
      if (!isPolling) {
        // 使用setTimeout确保状态更新后再开始轮询
        setTimeout(() => {
          startPolling()
        }, 0)
      }
    },
    [isPolling, startPolling, updateTaskLog]
  )

  // 获取任务状态
  const getTaskStatus = useCallback(
    (taskId: TaskIdentifier): ProgressStatusEnum | undefined => {
      const { columnId, rowId } = taskId

      // 先从活动任务列表中查找
      const activeTask = taskList.find((task) => task.columnId === columnId && task.rowId === rowId)
      if (activeTask) return activeTask.status

      // 如果不在活动列表中，从日志中查找记录
      const logEntry = taskLog.find((log) => log.columnId === columnId && log.rowId === rowId)
      return logEntry?.latestStatus
    },
    [taskList, taskLog]
  )

  // 重置单个任务状态 - 在UI已经完成更新后调用
  const resetTask = useCallback((taskId: TaskIdentifier) => {
    const { columnId, rowId } = taskId

    // 从活动列表中移除
    setTaskList((prevList) => {
      console.log('移除已完成任务', taskId)
      return prevList.filter((task) => !(task.columnId === columnId && task.rowId === rowId))
    })

    // 任务已经在UI更新完成后才被移除，无需额外处理
  }, [])

  // 重置所有任务
  const resetAllTasks = useCallback(() => {
    // 清空活动列表
    setTaskList([])
    // 清空任务日志
    setTaskLog([])

    // 停止轮询
    stopPolling()
  }, [stopPolling])

  // 上下文值
  const contextValue: TableAITaskState = {
    taskList,
    taskLog,
    isPolling,
    updateTask,
    initTasksFromStatus,
    getTaskStatus,
    resetTask,
    resetAllTasks,
  }

  return <TableAITaskContext.Provider value={contextValue}>{children}</TableAITaskContext.Provider>
}

// Hook 用于在组件中使用 AI 任务上下文
export const useTableAITask = () => {
  const context = useContext(TableAITaskContext)
  if (!context) {
    throw new Error('useTableAITask 必须在 TableAITaskProvider 内部使用')
  }
  return context
}
