import { GENERATE_TEXT } from '@/components/VisTable/config/status'
import { ProgressStatusEnum } from 'gel-api'
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const POLLING_INTERVAL = 5000
const MAX_TASKS_PER_POLL = 100
const MAX_COMPLETED_TASKS = 20

/**
 * 表示要处理的单个任务的标识符。
 */
export interface TaskIdentifier {
  sheetId: string
  columnId: string
  rowId: string
  originalContent?: string
  status?: ProgressStatusEnum
  sourceId?: string
}

/**
 * 表示任务的状态，包括其进度和结果。
 */
export interface TaskStatusItem {
  sheetId: string
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  timestamp: number
  content?: string
  originalContent?: string
  cellId?: string
  sourceId?: string
}

/**
 * 描述单个工作表的任务状态。
 */
export interface SheetState {
  /** 正在轮询的任务列表 */
  taskList: TaskStatusItem[]
  /** 等待处理的任务队列 */
  pendingTasks: TaskStatusItem[]
  /** 所有任务状态变更的日志，键为 `columnId-rowId` */
  taskLog: Map<string, TaskStatusItem[]>
  /** 指示此工作表是否正在进行轮询的标志 */
  isPolling: boolean
}

/**
 * 表示多个工作表的任务状态，由 sheetId 键控。
 */
export interface MultiSheetTaskState {
  [sheetId: string]: SheetState
}

export interface SheetTaskContextState {
  /** 当前活动工作表的ID。轮询仅对此工作表有效。 */
  activeSheetId: string | null
  /**
   * 设置活动工作表。一次只能有一个活动工作表。
   * 设置新的活动工作表将停止对前一个工作表的轮询。
   * @param sheetId 要激活的工作表ID，或传递 null 以停用所有工作表。
   */
  setActiveSheet: (sheetId: string | null) => void
  /**
   * 将一批任务添加到处理队列中。
   * 任务会进行防抖处理并一同处理。
   * @param tasks 要添加的任务标识符数组。
   */
  updateTasks: (tasks: TaskIdentifier[]) => void
  /**
   * 检索特定任务（单元格）的当前状态。
   * @param sheetId 工作表的ID。
   * @param columnId 列的ID。
   * @param rowId 行的ID。
   * @returns 任务的当前 `ProgressStatusEnum`，如果未找到则返回 `undefined`。
   */
  getTaskStatus: (sheetId: string, columnId: string, rowId: string) => ProgressStatusEnum | undefined
  /**
   * 注册一个回调函数，以便在任何任务完成时调用。
   * @param callback 完成任务时要调用的函数，它会接收一个已完成任务的数组。
   */
  registerOnTasksCompleted: (callback: (completedTasks: TaskStatusItem[]) => void) => void
  /**
   * 注销先前注册的回调函数。
   * @param callback 要移除的回调函数。
   */
  unregisterOnTasksCompleted: (callback: (completedTasks: TaskStatusItem[]) => void) => void
  /**
   * 获取特定工作表的完整状态对象。
   * @param sheetId 工作表的ID。
   * @returns `SheetState` 对象，如果工作表没有任务则返回 `undefined`。
   */
  getSheetState: (sheetId: string) => SheetState | undefined
  /**
   * 获取所有工作表的状态对象。
   * @returns `MultiSheetTaskState` 对象。
   */
  getAllSheetStates: () => MultiSheetTaskState
  /**
   * 检索所有工作表中最近完成的任务列表。
   * 此列表的大小受 `MAX_COMPLETED_TASKS` 限制。
   * @returns `TaskStatusItem` 数组。
   */
  getRecentlyCompleted: () => TaskStatusItem[]

  // --- 测试专用方法 ---
  /**
   * **仅供测试使用**
   * 从上下文中清除所有任务、日志和状态。停止任何活动的轮询。
   */
  clearAllTasks: () => void
  /**
   * **仅供测试使用**
   * 启用或禁用用于轮询的模拟API失败模式。
   * @param enabled 如果为 true，轮询请求将抛出错误。
   */
  setFailureMode: (enabled: boolean) => void
  /**
   * **仅供测试使用**
   * 从上下文中移除一个工作表及其所有关联状态。
   * 如果该工作表是活动的，它将被停用。
   * @param sheetId 要销毁的工作表ID。
   */
  destroySheet: (sheetId: string) => void
}

const SheetTaskContext = createContext<SheetTaskContextState | null>(null)

const getInitialSheetState = (): SheetState => ({
  taskList: [],
  pendingTasks: [],
  taskLog: new Map(),
  isPolling: false,
})

/**
 * SheetTaskProvider 提供了跨多个工作表管理后台任务（如AI单元格生成）的状态管理。
 * 它处理任务排队、轮询任务状态更新以及在工作表之间切换的功能。
 */
export const SheetTaskProvider = ({ children }: { children: ReactNode }) => {
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null)
  const [taskState, setTaskState] = useState<MultiSheetTaskState>({})
  const [recentlyCompleted, setRecentlyCompleted] = useState<TaskStatusItem[]>([])
  const [failureMode, setFailureMode] = useState(false)

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const taskQueueRef = useRef<TaskIdentifier[]>([])
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onTasksCompletedCallbacksRef = useRef<((completedTasks: TaskStatusItem[]) => void)[]>([])

  const stateRef = useRef(taskState)
  stateRef.current = taskState

  const activeSheetIdRef = useRef(activeSheetId)
  activeSheetIdRef.current = activeSheetId

  const failureModeRef = useRef(failureMode)
  failureModeRef.current = failureMode

  const poll = useCallback(async () => {
    const sheetId = activeSheetIdRef.current
    if (!sheetId) {
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
      return
    }

    const currentState = stateRef.current
    const sheet = currentState[sheetId] || getInitialSheetState()

    if (!sheet.isPolling) {
      console.log(`[Poll] Stopping poll for sheet ${sheetId} because isPolling is false.`)
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
      return
    }

    const tasksToPoll = [...sheet.taskList]
    const currentPending = [...sheet.pendingTasks]
    let didStateChange = false

    if (tasksToPoll.length < MAX_TASKS_PER_POLL && currentPending.length > 0) {
      const needed = MAX_TASKS_PER_POLL - tasksToPoll.length
      const newTasksForPolling = currentPending
        .splice(0, needed)
        .map((task) => ({ ...task, status: ProgressStatusEnum.RUNNING }))

      tasksToPoll.push(...newTasksForPolling)
      didStateChange = true
      console.log(`[Poll] Moved ${newTasksForPolling.length} tasks from pending to active for sheet ${sheetId}.`)
    }

    if (tasksToPoll.length === 0) {
      console.log(`[Poll] No tasks to poll for sheet ${sheetId}. Stopping.`)
      setTaskState((prev) => ({
        ...prev,
        [sheetId]: { ...(prev[sheetId] || getInitialSheetState()), isPolling: false },
      }))
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
      return
    }

    if (didStateChange) {
      setTaskState((prev) => ({
        ...prev,
        [sheetId]: {
          ...(prev[sheetId] || getInitialSheetState()),
          taskList: tasksToPoll,
          pendingTasks: currentPending,
        },
      }))
    }

    try {
      if (failureModeRef.current) {
        throw new Error('Simulated API Error')
      }

      console.log(`[DEMO MODE] Polling ${tasksToPoll.length} tasks on sheet ${sheetId}.`)
      const statusUpdates = tasksToPoll.map((task) => ({
        cellId: task.cellId,
        status: Math.random() < 0.3 ? ProgressStatusEnum.SUCCESS : ProgressStatusEnum.RUNNING,
        processedValue: Math.random() < 0.3 ? `Completed value for ${task.rowId}` : 'Running...',
      }))
      console.log(`[Polling] Mock response for sheet ${sheetId}:`, statusUpdates)

      const completedTasks: TaskStatusItem[] = []
      const stillInProgressTasks: TaskStatusItem[] = []
      const newLog = new Map(sheet.taskLog)

      tasksToPoll.forEach((task) => {
        const update = statusUpdates.find((s) => s.cellId === task.cellId)
        const updatedTask = update
          ? { ...task, status: update.status, content: update.processedValue, timestamp: Date.now() }
          : task

        if (updatedTask.status === ProgressStatusEnum.SUCCESS || updatedTask.status === ProgressStatusEnum.FAILED) {
          completedTasks.push(updatedTask)
        } else {
          stillInProgressTasks.push(updatedTask)
        }

        const key = `${updatedTask.columnId}-${updatedTask.rowId}`
        const history = newLog.get(key) || []
        if (history.length === 0 || history[history.length - 1].status !== updatedTask.status) {
          newLog.set(key, [...history, updatedTask])
        }
      })

      if (completedTasks.length > 0) {
        setRecentlyCompleted((prev) => [...completedTasks, ...prev].slice(0, MAX_COMPLETED_TASKS))
        onTasksCompletedCallbacksRef.current.forEach((cb) => cb(completedTasks))
      }

      setTaskState((prev) => ({
        ...prev,
        [sheetId]: { ...(prev[sheetId] || getInitialSheetState()), taskList: stillInProgressTasks, taskLog: newLog },
      }))
    } catch (error) {
      console.error(`[Polling] Sheet ${sheetId} poll error:`, error)
    }

    pollingTimerRef.current = setTimeout(poll, POLLING_INTERVAL)
  }, [])

  const startPolling = useCallback(
    (sheetId: string) => {
      console.log(`[Action] Request to start polling for sheet ${sheetId}`)
      const currentState = stateRef.current
      const sheet = currentState[sheetId] || getInitialSheetState()
      if (sheet.isPolling) {
        console.log(`[Action] Start polling skipped: already polling sheet ${sheetId}.`)
        return
      }
      setTaskState((prev) => ({
        ...prev,
        [sheetId]: { ...(prev[sheetId] || getInitialSheetState()), isPolling: true },
      }))
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current)
      pollingTimerRef.current = setTimeout(poll, 1)
    },
    [poll]
  )

  const stopPolling = useCallback(() => {
    const sheetId = activeSheetIdRef.current
    if (pollingTimerRef.current) {
      console.log(`[Action] Clearing polling timer.`)
      clearTimeout(pollingTimerRef.current)
      pollingTimerRef.current = null
    }
    if (sheetId && stateRef.current[sheetId]?.isPolling) {
      console.log(`[Action] Request to stop polling for sheet ${sheetId}`)
      setTaskState((prev) => ({
        ...prev,
        [sheetId]: { ...(prev[sheetId] || getInitialSheetState()), isPolling: false },
      }))
    }
  }, [])

  useEffect(() => {
    const sheetId = activeSheetId
    if (!sheetId) {
      stopPolling()
      return
    }

    const sheet = taskState[sheetId] || getInitialSheetState()
    console.log(
      `[Effect Check] Sheet: ${sheetId}, isPolling: ${sheet.isPolling}, pending: ${sheet.pendingTasks.length}, active: ${sheet.taskList.length}`
    )

    if (!sheet.isPolling && (sheet.pendingTasks.length > 0 || sheet.taskList.length > 0)) {
      console.log(`[Effect Action] Conditions met. Triggering startPolling for sheet ${sheetId}.`)
      startPolling(sheetId)
    }
  }, [taskState, activeSheetId, startPolling, stopPolling])

  const setActiveSheet = useCallback(
    (sheetId: string | null) => {
      console.log(`[Action] Setting active sheet from ${activeSheetIdRef.current} to ${sheetId}`)
      stopPolling()
      setActiveSheetId(sheetId)
    },
    [stopPolling]
  )

  const processTaskQueue = useCallback(() => {
    const tasksToProcess = [...taskQueueRef.current]
    taskQueueRef.current = []
    if (tasksToProcess.length === 0) return

    console.log(`[Queue] Processing ${tasksToProcess.length} tasks.`)

    const tasksBySheet: Record<string, TaskIdentifier[]> = {}
    tasksToProcess.forEach((task) => {
      if (!tasksBySheet[task.sheetId]) tasksBySheet[task.sheetId] = []
      if (!tasksBySheet[task.sheetId].some((t) => t.rowId === task.rowId && t.columnId === task.columnId)) {
        tasksBySheet[task.sheetId].push(task)
      }
    })

    for (const sheetIdStr in tasksBySheet) {
      const sheetId = sheetIdStr
      const sheetTasks = tasksBySheet[sheetId]

      const currentSheet = stateRef.current[sheetId] || getInitialSheetState()
      const uniqueSheetTasks = sheetTasks.filter((task) => {
        const alreadyExists =
          currentSheet.pendingTasks.some((t) => t.rowId === task.rowId && t.columnId === task.columnId) ||
          currentSheet.taskList.some((t) => t.rowId === task.rowId && t.columnId === task.columnId)

        if (alreadyExists) {
          console.log(
            `[Queue] Duplicate task (already in state) ignored for sheet ${sheetId}: ${task.columnId}/${task.rowId}`
          )
        }

        return !alreadyExists
      })

      if (uniqueSheetTasks.length === 0) {
        continue
      }

      const newPendingTasks: TaskStatusItem[] = uniqueSheetTasks.map((task, i) => ({
        ...task,
        sheetId,
        cellId: `cell-${task.sheetId}-${task.columnId}-${task.rowId}-${i}`,
        status: ProgressStatusEnum.PENDING,
        timestamp: Date.now(),
        content: GENERATE_TEXT,
      }))

      setTaskState((prev) => {
        const currentSheet = prev[sheetId] || getInitialSheetState()
        console.log(`[Queue] Adding ${newPendingTasks.length} tasks to pending queue for sheet ${sheetId}.`)
        return {
          ...prev,
          [sheetId]: {
            ...currentSheet,
            pendingTasks: [...currentSheet.pendingTasks, ...newPendingTasks],
          },
        }
      })
    }
  }, [])

  const updateTasks = useCallback(
    (tasks: TaskIdentifier[]) => {
      taskQueueRef.current.push(...tasks)
      if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current)
      processingTimeoutRef.current = setTimeout(processTaskQueue, 100)
    },
    [processTaskQueue]
  )

  const getTaskStatus = useCallback(
    (sheetId: string, columnId: string, rowId: string): ProgressStatusEnum | undefined => {
      const sheet = stateRef.current[sheetId]
      if (!sheet) return undefined
      const key = `${columnId}-${rowId}`
      const history = sheet.taskLog.get(key)
      return history?.[history.length - 1]?.status
    },
    []
  )

  const getSheetState = useCallback((sheetId: string) => stateRef.current[sheetId], [])
  const getAllSheetStates = useCallback(() => stateRef.current, [])
  const getRecentlyCompleted = useCallback(() => recentlyCompleted, [recentlyCompleted])

  const registerOnTasksCompleted = useCallback((callback: (completedTasks: TaskStatusItem[]) => void) => {
    onTasksCompletedCallbacksRef.current.push(callback)
  }, [])

  const unregisterOnTasksCompleted = useCallback((callback: (completedTasks: TaskStatusItem[]) => void) => {
    onTasksCompletedCallbacksRef.current = onTasksCompletedCallbacksRef.current.filter((cb) => cb !== callback)
  }, [])

  // Test-specific methods
  const clearAllTasks = useCallback(() => {
    stopPolling()
    setTaskState({})
    setRecentlyCompleted([])
    taskQueueRef.current = []
    console.clear()
    console.log('[TEST] All tasks and states have been cleared.')
  }, [stopPolling])

  const destroySheet = useCallback(
    (sheetId: string) => {
      if (activeSheetIdRef.current === sheetId) {
        stopPolling()
        setActiveSheetId(null)
      }
      setTaskState((prev) => {
        const newState = { ...prev }
        delete newState[sheetId]
        return newState
      })
      console.log(`[TEST] Sheet ${sheetId} has been destroyed.`)
    },
    [stopPolling]
  )

  const contextValue: SheetTaskContextState = {
    activeSheetId,
    setActiveSheet,
    updateTasks,
    getTaskStatus,
    registerOnTasksCompleted,
    unregisterOnTasksCompleted,
    getSheetState,
    getAllSheetStates,
    getRecentlyCompleted,
    // Test-specific methods
    clearAllTasks,
    setFailureMode,
    destroySheet,
  }

  return <SheetTaskContext.Provider value={contextValue}>{children}</SheetTaskContext.Provider>
}

/**
 * `useSheetTask` 是一个自定义Hook，用于访问 `SheetTaskContext`。
 * 它必须在 `SheetTaskProvider` 的子组件中使用。
 * @returns {SheetTaskContextState} 包含了管理任务所需的所有状态和方法。
 */
export const useSheetTask = () => {
  const context = useContext(SheetTaskContext)
  if (!context) throw new Error('useSheetTask must be used within a SheetTaskProvider')
  return context
}
