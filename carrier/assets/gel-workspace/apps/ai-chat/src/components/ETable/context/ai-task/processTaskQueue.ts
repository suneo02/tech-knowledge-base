import { requestToSuperlistFcs } from '@/api'
import { ProgressStatusEnum } from 'gel-api'
import { initCellStatus } from './initCellStatus'
import type { TaskIdentifier, TaskStatusItem } from '@/components/ETable/context/ai-task/types'

export const processTaskQueue = async (
  list: TaskIdentifier[],
  sheetId: number,
  totalRowCount?: number
): Promise<TaskStatusItem[]> => {
  let initialTaskItems: TaskStatusItem[] = []

  if (!list || list.length === 0) return []

  if (list.length === 1) {
    const taskItem = await initCellStatus(list[0], sheetId)
    initialTaskItems = [taskItem]
  } else {
    const columnId = list[0].columnId
    const allSameColumn = list.every((task) => task.columnId === columnId)
    const isFullColumnRun = totalRowCount ? list.length === totalRowCount : false

    if (allSameColumn && isFullColumnRun) {
      try {
        const res = await requestToSuperlistFcs('excel/runColumn', { columnId, sheetId })
        const result = res?.result
        const data = Array.isArray(result?.data) ? result.data : []
        if (data.length) {
          initialTaskItems = data.map((task) => ({
            cellId: task.cellId,
            columnId: task.columnId,
            rowId: task.rowId,
            status: ProgressStatusEnum.PENDING,
            timestamp: Date.now(),
            originalContent: task.processedValue,
          }))
        }
      } catch (error) {
        initialTaskItems = list.map((task) => ({
          columnId: task.columnId,
          rowId: task.rowId,
          status: ProgressStatusEnum.FAILED,
          timestamp: Date.now(),
          originalContent: task.originalContent,
          sourceId: task.sourceId,
        }))
      }
    } else if (allSameColumn && !isFullColumnRun) {
      const taskResults = await Promise.all(
        list.map(async (task) => {
          try {
            return await initCellStatus(task, sheetId)
          } catch (error) {
            return {
              columnId: task.columnId,
              rowId: task.rowId,
              status: ProgressStatusEnum.FAILED,
              timestamp: Date.now(),
              originalContent: task.originalContent,
              sourceId: task.sourceId,
            }
          }
        })
      )
      initialTaskItems = taskResults
    } else {
      const tasksByColumn: Record<string, TaskIdentifier[]> = {}
      list.forEach((task) => {
        if (!tasksByColumn[task.columnId]) tasksByColumn[task.columnId] = []
        tasksByColumn[task.columnId].push(task)
      })

      const columnResults = await Promise.all(
        Object.entries(tasksByColumn).map(async ([colId, tasks]) => {
          try {
            await requestToSuperlistFcs('excel/runColumn', { columnId: colId, sheetId })
            return tasks.map((task) => ({
              columnId: task.columnId,
              rowId: task.rowId,
              status: ProgressStatusEnum.PENDING,
              timestamp: Date.now(),
              originalContent: task.originalContent,
            }))
          } catch (error) {
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

      initialTaskItems = columnResults.flat()
    }
  }

  return initialTaskItems
}
