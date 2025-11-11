import { requestToSuperlistFcs } from '@/api'
import { GENERATE_TEXT } from '@/components/VisTable/config/status'
import { ProgressStatusEnum } from 'gel-api'
import type { TaskIdentifier, TaskStatusItem } from '@/components/ETable/context/ai-task/types'

export const initCellStatus = async (taskId: TaskIdentifier, sheetId: number): Promise<TaskStatusItem> => {
  const { columnId, rowId } = taskId
  try {
    const res = await requestToSuperlistFcs('excel/runCell', { columnId, rowId, sheetId })
    const cellId: string | undefined = res?.result?.cellId
    const status: ProgressStatusEnum = res?.result?.status || ProgressStatusEnum.PENDING
    const sourceId: string | undefined = res?.result?.sourceId

    return {
      columnId,
      rowId,
      status,
      cellId,
      timestamp: Date.now(),
      originalContent: taskId.originalContent,
      processedValue: status === ProgressStatusEnum.PENDING ? GENERATE_TEXT : taskId.originalContent,
      sourceId,
    }
  } catch (error) {
    console.error(`单元格runCell API调用失败(${columnId},${rowId}):`, error)
    return {
      columnId,
      rowId,
      status: ProgressStatusEnum.FAILED,
      timestamp: Date.now(),
      originalContent: taskId.originalContent,
      sourceId: taskId.sourceId,
    }
  }
}
