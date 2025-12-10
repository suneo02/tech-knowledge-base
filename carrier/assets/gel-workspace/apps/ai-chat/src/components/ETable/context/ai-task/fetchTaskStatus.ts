import { requestToWFCSuperlistFcs } from '@/api'
import { ProgressStatusEnum } from 'gel-api'
import type { TaskStatusItem } from '@/components/ETable/context/ai-task/types'

export const fetchTaskStatus = async (taskItems: TaskStatusItem[], sheetId: number): Promise<TaskStatusItem[]> => {
  try {
    const tasksWithCellId = taskItems.filter((task) => task.cellId)
    if (tasksWithCellId.length === 0) return taskItems

    const cellIds = tasksWithCellId.map((task) => task.cellId as string)
    const res = await requestToWFCSuperlistFcs('superlist/excel/getCellsStatus', { cellIds, sheetId })
    const cellStatusList = Array.isArray(res?.Data?.data) ? res.Data.data : []

    return taskItems.map((task) => {
      if (!task.cellId) return task
      const cellStatus = cellStatusList.find((cell) => cell.cellId === task.cellId)
      if (cellStatus) {
        return {
          ...task,
          status: cellStatus.status,
          content: cellStatus.processedValue,
          sourceId: cellStatus.sourceId,
          timestamp: Date.now(),
        }
      }
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
