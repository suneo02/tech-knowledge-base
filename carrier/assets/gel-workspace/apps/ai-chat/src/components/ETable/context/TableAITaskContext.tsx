import { ProgressStatusEnum } from 'gel-api'
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { fetchTaskStatus } from './ai-task/fetchTaskStatus'
import { processTaskQueue as processTaskQueueUtil } from './ai-task/processTaskQueue'
import type { TaskHistoryLog, TaskIdentifier, TaskStatusItem } from './ai-task/types'
import { fetchPoints, useAppDispatch } from '@/store'

// 引用类型定义见 ./ai-task/types

// AI任务上下文状态接口
export interface TableAITaskState {
  // 任务状态映射表 - 只包含进行中的任务
  taskList: TaskStatusItem[]
  // 任务日志表 - 记录每个单元格的所有历史操作
  taskLog: TaskHistoryLog[]
  // 是否正在进行轮询
  isPolling: boolean
  // 更新任务列表并开始或继续轮询
  updateTask: (list: TaskIdentifier[], totalRowCount?: number) => void
  // 仅添加任务，不触发 runCell
  addTasksOnly: (list: TaskIdentifier[]) => void
  // 从已有状态初始化任务，不触发runCell API
  initTasksFromStatus: (list: TaskIdentifier[]) => void
  // 获取任务状态
  getTaskStatus: (taskId: TaskIdentifier) => ProgressStatusEnum | undefined
  // 重置任务状态
  resetTask: (taskId: TaskIdentifier) => void
  // 重置所有任务
  resetAllTasks: () => void
  // 注册任务完成回调
  registerOnTasksCompleted: (callback: (completedTasks: TaskStatusItem[]) => void) => void
  // 注销任务完成回调
  unregisterOnTasksCompleted: (callback: (completedTasks: TaskStatusItem[]) => void) => void
}

// 从已有状态初始化任务列表（不触发runCell）
const initTasksFromExistingStatus = (taskItems: TaskIdentifier[]): TaskStatusItem[] => {
  return taskItems.map((taskItem) => ({
    columnId: taskItem.columnId,
    rowId: taskItem.rowId,
    status: taskItem.status || ProgressStatusEnum.PENDING,
    timestamp: Date.now(),
    originalContent: taskItem.originalContent,
    cellId: taskItem.cellId, // 若已有cellId则直接带入，便于立即参与轮询
    sourceId: taskItem.sourceId,
  }))
}

// 创建上下文
const TableAITaskContext = createContext<TableAITaskState | null>(null)

// Provider 组件
interface TableAITaskProviderProps {
  children: ReactNode
  sheetId: number
}

export const TableAITaskProvider = ({ children, sheetId }: TableAITaskProviderProps) => {
  const dispatch = useAppDispatch()
  // 任务状态列表 - 只包含进行中的任务
  const [taskList, setTaskList] = useState<TaskStatusItem[]>([])
  // 任务日志 - 记录所有任务历史，包含完整的状态变化记录
  const [taskLog, setTaskLog] = useState<TaskHistoryLog[]>([])
  // 轮询标志
  const [isPolling, setIsPolling] = useState(false)
  // 轮询间隔时间（毫秒）
  const POLLING_INTERVAL = 5000
  // 轮询定时器引用
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const onTasksCompletedCallbackRef = useRef<(((completedTasks: TaskStatusItem[]) => void) | null)[]>([])

  // 用于批量处理任务的队列和计时器
  const taskQueueRef = useRef<TaskIdentifier[]>([])
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const registerOnTasksCompleted = useCallback((callback: (completedTasks: TaskStatusItem[]) => void) => {
    onTasksCompletedCallbackRef.current.push(callback)
  }, [])

  const unregisterOnTasksCompleted = useCallback((callback: (completedTasks: TaskStatusItem[]) => void) => {
    onTasksCompletedCallbackRef.current = onTasksCompletedCallbackRef.current.filter((cb) => cb !== callback)
  }, [])

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
            const tasksWithNewStatus: TaskStatusItem[] = []
            const newlyCompletedTasks: TaskStatusItem[] = []

            prevList.forEach((item) => {
              const taskStatus = taskStatusList.find(
                (status) => status.columnId === item.columnId && status.rowId === item.rowId
              )

              if (taskStatus) {
                // 添加当前任务状态到日志中
                const fullTaskStatus = {
                  ...item,
                  status: taskStatus.status,
                  content: taskStatus.content,
                  timestamp: Date.now(),
                  cellId: taskStatus.cellId || item.cellId,
                }
                tasksWithNewStatus.push(fullTaskStatus)

                const wasCompleted =
                  item.status === ProgressStatusEnum.SUCCESS || item.status === ProgressStatusEnum.FAILED
                const isCompleted =
                  taskStatus.status === ProgressStatusEnum.SUCCESS || taskStatus.status === ProgressStatusEnum.FAILED

                if (!wasCompleted && isCompleted) {
                  dispatch(fetchPoints()) // 扣除积分
                  newlyCompletedTasks.push(fullTaskStatus)
                }

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
                    sourceId: taskStatus.sourceId || item.sourceId,
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
                    sourceId: taskStatus.sourceId || item.sourceId,
                  })
                }
              } else {
                // 如果没有找到对应的任务状态，保留原状态
                updatedTasks.push(item)
              }
            })

            // 将任务更新到日志
            if (tasksWithNewStatus.length > 0) {
              updateTaskLog(tasksWithNewStatus)
            }

            if (newlyCompletedTasks.length > 0 && onTasksCompletedCallbackRef.current) {
              onTasksCompletedCallbackRef.current.forEach((callback) => {
                if (callback) {
                  callback(newlyCompletedTasks)
                }
              })
            }

            // 如果所有任务都已完成，停止轮询
            if (updatedTasks.length === 0) {
              console.log('所有任务已完成，停止轮询')
              dispatch(fetchPoints()) // 扣除积分
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
    // 使用 ref 来防止因 state 闭包导致的多重轮询
    if (isPolling) return
    setIsPolling(true)
    // 首次轮询立即开始
    poll()
  }, [isPolling, poll])

  // 真正处理任务的函数
  const processTaskQueue = useCallback(
    async (totalRowCount?: number) => {
      const list = [...taskQueueRef.current]
      taskQueueRef.current = []

      console.log('📋 [ProcessQueue] 开始处理任务队列:', {
        taskCount: list?.length || 0,
        tasks: list?.map((t) => `${t.columnId}:${t.rowId}`),
        sheetId,
      })

      if (!list || list.length === 0) {
        console.log('⚠️ [ProcessQueue] 任务队列为空，跳过处理')
        return
      }

      const initialTaskItems: TaskStatusItem[] = await processTaskQueueUtil(list, sheetId, totalRowCount)

      console.log('💾 [ProcessQueue] 更新任务日志...')
      updateTaskLog(initialTaskItems)

      setTaskList((prevList) => {
        console.log('🔄 [ProcessQueue] 更新任务状态列表:', {
          previousCount: prevList.length,
          newTaskCount: initialTaskItems.length,
        })

        const newTasks = [...prevList]
        let addedCount = 0
        let updatedCount = 0

        initialTaskItems.forEach((taskItem) => {
          const { columnId, rowId, cellId, status } = taskItem
          const existingTaskIndex = newTasks.findIndex((task) => task.columnId === columnId && task.rowId === rowId)

          if (existingTaskIndex === -1) {
            newTasks.push(taskItem)
            addedCount++
          } else {
            newTasks[existingTaskIndex] = {
              ...newTasks[existingTaskIndex],
              status: status,
              timestamp: Date.now(),
              cellId: cellId || newTasks[existingTaskIndex].cellId,
              originalContent: taskItem.originalContent || newTasks[existingTaskIndex].originalContent,
            }
            updatedCount++
          }
        })

        console.log('📊 [ProcessQueue] 任务列表更新完成:', {
          totalTasks: newTasks.length,
          addedTasks: addedCount,
          updatedTasks: updatedCount,
          activeTasks: newTasks.filter(
            (t) => t.status !== ProgressStatusEnum.SUCCESS && t.status !== ProgressStatusEnum.FAILED
          ).length,
        })

        return newTasks
      })

      // 使用 ref 访问 isPolling 的最新状态
      if (!isPolling) {
        console.log('🔄 [ProcessQueue] 启动轮询监控任务状态...')
        setTimeout(() => {
          startPolling()
        }, 0)
      } else {
        console.log('🔄 [ProcessQueue] 轮询已在进行中，无需重新启动')
      }

      console.log('✅ [ProcessQueue] 任务处理流程完成')
    },
    [sheetId, updateTaskLog, isPolling, startPolling]
  )

  // 更新任务列表 - 现在只负责将任务加入队列并触发处理
  const updateTask = useCallback(
    (list: TaskIdentifier[], totalRowCount?: number) => {
      taskQueueRef.current.push(...list)

      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }

      processingTimeoutRef.current = setTimeout(() => {
        processTaskQueue(totalRowCount)
      }, 100) // 100ms的防抖时间，以聚合短时间内的多个任务
    },
    [processTaskQueue]
  )

  // 仅添加任务，不触发 runCell（外部预登记）
  const addTasksOnly = useCallback((list: TaskIdentifier[]) => {
    if (!list || list.length === 0) return
    const initialTaskItems = initTasksFromExistingStatus(list)
    setTaskList((prevList) => {
      const newTasks = [...prevList]
      initialTaskItems.forEach((taskItem) => {
        const existingTaskIndex = newTasks.findIndex(
          (task) => task.columnId === taskItem.columnId && task.rowId === taskItem.rowId
        )
        if (existingTaskIndex === -1) newTasks.push(taskItem)
      })
      return newTasks
    })
    // 仅添加任务后，也应启动轮询（如果未启动）
    if (!isPolling) {
      setTimeout(() => {
        startPolling()
      }, 0)
    }
  }, [])

  // 组件卸载时清理轮询和队列处理
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current)
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
    }
  }, [])

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
    addTasksOnly,
    initTasksFromStatus,
    getTaskStatus,
    resetTask,
    resetAllTasks,
    registerOnTasksCompleted,
    unregisterOnTasksCompleted,
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
