import { ChatRawSentenceIdIdentifier, ChatRawSentenceIdentifier } from '@/chat'
import { AiModelEnum, AiToolEnum } from '@/types'
import { QueryFilter } from '@/windSecure'
import { BaseSheetRequest, BaseTableRequest, CellStatusItem, Column, RowData, Sheet } from '../../shared/types'

/**
 * 表格操作命令类型
 */
export type OperationCommand =
  | 'update_cell'
  | 'run_cell'
  | 'update_column'
  | 'move_column'
  | 'add_column'
  | 'delete_column'
  | 'rename_column'
  | 'run_column'
  | 'filter_column'
  | 'sort_column'
  | 'hide_column'
  | 'delete_row'
  | 'add_row'
  | 'run_row'
  | 'undo'
  | 'redo'

/**
 * 操作参数接口
 */
export interface UpdateCellParams {
  rowId: string
  columnId: string
  value: unknown
}

export interface MoveColumnParams {
  columnId: string
  newColumnIndex: number
}

export interface UpdateColumnParams {
  columnId: string
  newColumnIndex?: number
  isDelete?: boolean
  newColumnName?: string
}

export interface AddColumnParams {
  columnName: string
  columnId?: string
  columnIndex?: number
}

export interface DeleteColumnParams {
  columnId: string
}

export interface RenameColumnParams {
  columnId: string
  newColumnName: string
}

export interface RunColumnParams {
  columnId: string
}

export interface FilterColumnParams {
  columnId: string
  filterCondition: unknown
}

export interface SortColumnParams {
  tableId: string
  columnId: string
  sortType: 'asc' | 'desc'
}

export interface HideColumnParams {
  columnId: string
  isHidden: boolean
}

export interface DeleteRowParams {
  rowId: string
}

export interface AddRowParams {
  rowId?: string
  rowIndex?: number
}

export interface RunRowParams {
  rowId: string
}

export interface RunCellParams {
  rowId: string
  columnId: string
  sheetId: number
}

/**
 * 请求类型定义
 */
export interface GetSourceDetailRequest {
  sourceId: string
}

export interface GetTableInfoRequest extends BaseTableRequest {
  conversationId: string
}

export type GetSheetInfoRequest = BaseSheetRequest

export type GetSheetColumnsRequest = BaseSheetRequest

export type GetSheetAllRowIdsRequest = BaseSheetRequest

export type GetRowsDetailRequest =
  | {
      rowIds: string[]
    }
  | {
      sheetId: number
      pageNo: number
      pageSize: number
    }

export interface TableOperationRequest {
  cmd: OperationCommand
  payload?:
    | UpdateCellParams
    | RunCellParams
    | UpdateColumnParams
    | AddColumnParams
    | DeleteColumnParams
    | RenameColumnParams
    | RunColumnParams
    | FilterColumnParams
    | SortColumnParams
    | HideColumnParams
    | DeleteRowParams
    | AddRowParams
    | RunRowParams
    | MoveColumnParams
  operationNo: number
  sheetId: number
}

export interface AiInsertColumnRequest {
  columnId: string
  columnIndex?: number
  sheetId: number
  prompt: string
  aiModel: AiModelEnum
  tool: { [key in AiToolEnum]: object }
  promptPattern: string
  enableAutoUpdate: boolean
}

export interface GetAiInsertColumnParamRequest {
  columnId: string
}

export interface AddSheetRequest {
  sheetName: string
  tableId: string
}

export type DeleteSheetRequest = BaseSheetRequest

export interface UpdateSheetRequest extends BaseSheetRequest {
  sheetName: string
}

export interface UpdateTableNameRequest extends BaseTableRequest {
  tableName: string
}

export interface DownloadSheetRequest extends BaseSheetRequest {
  filters?: {
    columnId: string
    filterType: number
    filterValue: string
  }[]
  sort?: {
    columnId: string
    sortType: 'asc' | 'desc'
  }
}

export interface CustomerPointCountByAiColumnRequest {
  aiModel: number
  sheetId: number
  tool: { [key: string]: object }
}

export interface CustomerPointCountByColumnIndicatorRequest {
  sheetId: number
  tableId: string
  classificationList: {
    id: number
    rootName: string
    displayName: string
    indicators: {
      spId: number
      displayName: string
    }[]
  }[]
}

export interface GetCellsStatusRequest {
  cellIds: string[]
  sheetId: number
}

/**
 * 响应类型定义
 */
export interface GetTableInfoResponse {
  sheetInfos: Sheet[]
  tableName: string
  cdeFilter: QueryFilter[]
}

export interface GetSourceDetailFromAiColumnResponse extends ChatRawSentenceIdIdentifier {
  /** AI生成答案 */
  answer: string
  /** 列名 */
  columnName: string
  /** dpu列表 */
  dpuList: unknown[]
  /** 执行状态 */
  executeStatus: number
  /** ai模型 */
  model: number
  /** 进度 */
  progress: string
  /** prompt模板 */
  promptPattern: string
  /** 问题 */
  question: string
  /** rag列表 */
  ragList: unknown[]
  /** 选择的工具 */
  selectTools: Record<string, unknown>
  /** 源ID */
  sourceId: string
  /** 类型 */
  type: number
  /** 使用的工具 */
  usedTools: Record<string, unknown>
}

export interface GetSourceDetailResponse
  extends GetSourceDetailFromAiColumnResponse,
    ChatRawSentenceIdIdentifier,
    ChatRawSentenceIdentifier {
  cdeDescription: string
  cdeFilterCondition: string
  cdeFilterID: string
  createTime: string
  sourceId: string
  type: number
  updateTime: string
  answer: string
  columnName: string
  model: number
  progress: string
  promptPattern: string
  question: string
  selectTools: { [key: string]: unknown }
  source: string
  indicatorFilterId?: number
  indicatorId?: string
  indicatorFilterDetail?: string
  answers?: string
}

export interface GetSheetInfoResponse {
  operationNoComplete: number
  canQueryIndicator: boolean
  canAddIndicatorToCurrent: boolean
  canAddCdeToCurrent: boolean
}

export interface GetSheetColumnsResponse {
  columns: Column[]
}

export interface GetSheetAllRowIdsResponse {
  rowIds: string[]
}

export interface GetRowsDetailResponse {
  data: RowData[]
}

export interface TableOperationResponse {
  code: number
  msg: string
  result?: unknown
  rowId?: string
  columnId?: string
  rowIds?: string[]
}

export interface AiInsertColumnResponse {
  data: {
    cellId: string
    columnId: string
    processedValue: string
    rowId: string
    status: number
  }[]
}

export interface GetAiInsertColumnParamResponse {
  aiModel: AiModelEnum
  columnId: string
  prompt: string
  promptPattern: string
  tool: { [key: string]: object }
}

export interface AddSheetResponse {
  data: number
}

export interface DeleteSheetResponse {
  msg: string
}

export interface UpdateSheetResponse {
  msg: string
}

export interface UpdateTableNameResponse {
  msg: string
}

export interface DownloadSheetResponse {
  downloadUrl: string
  fileName: string
}

export interface GetCellsStatusResponse {
  data: CellStatusItem[]
}

export interface CustomerPointCountByAiColumnResponse {
  pointTotal: number
  recordList: unknown[]
  recordTotal: number
}

export interface CustomerPointCountByColumnIndicatorResponse {
  pointTotal: number
  recordList: {
    displayName: string
    id: number
    pointPriceSum: number
    rootName: string
    total: number
  }[]
  recordTotal: number
}
