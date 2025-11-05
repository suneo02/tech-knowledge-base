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

export interface RunColumnRequest {
  sheetId: number
  columnId: string
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
