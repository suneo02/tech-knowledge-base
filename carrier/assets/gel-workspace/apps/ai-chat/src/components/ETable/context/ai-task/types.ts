import { ProgressStatusEnum } from 'gel-api'

export interface TaskIdentifier {
  columnId: string
  rowId: string
  cellId?: string
  originalContent?: string
  status?: ProgressStatusEnum
  errorMessage?: string
  sourceId?: string
}

export interface TaskStatusItem {
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  timestamp?: number
  content?: string
  originalContent?: string
  cellId?: string
  processedValue?: string
  sourceId?: string
}

export interface TaskHistoryLog {
  columnId: string
  rowId: string
  history: TaskStatusItem[]
  latestStatus: ProgressStatusEnum
  latestTimestamp?: number
  originalContent?: string
  cellId?: string
}
