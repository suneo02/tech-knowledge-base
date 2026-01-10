import { useState } from 'react'
import { useRequest } from 'ahooks'
import { TaskStatus } from 'gel-api'
import type { CurrentTaskDetail, GroupTaskItem } from 'gel-api'
import { splAgentTaskDetail } from '../services'

export const useTaskPolling = (
  taskId: string,
  onTasksLoaded?: (tasks: GroupTaskItem[], currentTask?: CurrentTaskDetail) => void
) => {
  const [currentTask, setCurrentTask] = useState<CurrentTaskDetail>()
  const [groupTasks, setGroupTasks] = useState<GroupTaskItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    cancel,
    run: startPolling,
    loading: isPolling,
  } = useRequest(() => splAgentTaskDetail(Number(taskId)), {
    pollingInterval: 5000,
    pollingErrorRetryCount: 3,
    refreshDeps: [taskId],
    onBefore: () => {
      // Only set loading if we don't have data for this task yet (switching tasks)
      if (!currentTask || String(currentTask.taskId) !== taskId) {
        setIsLoading(true)
      }
    },
    onSuccess: (res) => {
      if (res && res.Data) {
        // Auto cancel if all finished
        if (
          res.Data.groupTasks.every(
            (item: GroupTaskItem) =>
              item.status === TaskStatus.SUCCESS ||
              item.status === TaskStatus.FAILED ||
              item.status === TaskStatus.TERMINATED
          )
        ) {
          cancel()
        }
        const tasks = res.Data.groupTasks || []
        setGroupTasks(tasks)
        setCurrentTask(res.Data.currentTask)
        onTasksLoaded?.(tasks, res.Data.currentTask)
      }
      setIsLoading(false)
      return res
    },
    onError: () => {
      setIsLoading(false)
    },
  })

  return {
    currentTask,
    groupTasks,
    setGroupTasks,
    setCurrentTask, // Exposed in case we need to manually update (e.g. optimistic updates)
    isLoading,
    isPolling,
    startPolling,
    cancelPolling: cancel,
  }
}
