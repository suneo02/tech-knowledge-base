import { ProgressStatusEnum } from '@/types'

export interface RunCellRequest {
  rowId: string
  columnId: string
  sheetId: number
}

export interface GenerateColumnNameRequest {
  promptText: string
  sheetId: number
  columnId: string
}

export enum RunColumnStatus {
  ALL = 0, // 默认运行全部
  PENDING = 1, // 待处理行
  TOP_10 = 2, // 前10行
}

export interface RunColumnRequest {
  sheetId: number
  columnId: string
  statusToRun?: RunColumnStatus // 默认运行全部， 1是待处理行 2是前10行
}

export interface RunColumnResponse {
  data: {
    cellId: string
    columnId: string
    processedValue: string
    rowId: string
    status: ProgressStatusEnum
  }[]
}

export interface GenerateColumnNameResponse {
  msg: string
}

export interface RunCellResponse {
  cellId: string
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  sourceId: string
  processedValue: string
}
