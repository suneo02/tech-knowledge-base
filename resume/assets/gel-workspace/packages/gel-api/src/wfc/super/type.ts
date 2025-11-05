import { AiModelEnum, AiToolEnum, ProgressStatusEnum, SourceTypeEnum } from '@/types'

/**
 * 单元格元数据类型
 * 基本出现在 & 结尾的columnId中
 * @example
 * 3cyk7cFlDRf3tM&: {processedValue: "19991101", status: 2, rowIndex: 1, columnIndex: 5, columnId: "3cyk7cFlDRf3tM",…}
 */
export interface CellMetadata {
  processedValue?: string // 处理后的值
  status: ProgressStatusEnum // 状态
  rowIndex?: number // 行索引
  columnIndex?: number // 列索引
  columnId: string // 列ID
  rowId: string // 行ID
  cellId: string // 单元格ID
  sourceId?: string // 源ID
  sourceType: SourceTypeEnum // 源类型
  // 其他可能的元数据字段
}

/**
 * 行数据类型
 * @example
 * {
 *   3cyk7cFlDRf3tM: "19991101"
 *   3cyk7cFlDRf3tM&: {processedValue: "19991101", status: 2, rowIndex: 1, columnIndex: 5, columnId: "3cyk7cFlDRf3tM",…}
 *   98MfQwdJ5JGxiw: "旅游饭店"
 *   98MfQwdJ5JGxiw&: {processedValue: "旅游饭店", status: 2, rowIndex: 1, columnIndex: 3, columnId: "98MfQwdJ5JGxiw",…}
 * }
 */
export interface RowData {
  rowId: string
  [columnId: string]: string | CellMetadata
}

export interface Sheet {
  sheetId: number
  sheetName: string
  sheetIndex: number
}

export interface FilterItem {
  columnId: string
  filterType: number // TODO 枚举
  filterValue: string
  joinType: number // TODO 枚举
}

export interface Column {
  columnId: string
  columnName?: string
  columnIndex?: number
  dataType?: number // TODO 枚举
  filterItems?: FilterItem[]
  initSourceType?: SourceTypeEnum
  isFrozen?: boolean
  title?: string
  width?: string | number
  editor?: string
  headerEditor?: string
  field?: string
  headerIcon?: string
  icon?: string
}

// 表格操作类型
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

// 操作参数接口
export interface UpdateCellParams {
  rowId: string
  columnId: string
  value: any
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
  filterCondition: any
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

export interface CellStatusItem {
  cellId: string
  columnId: string
  rowId: string
  status: ProgressStatusEnum
  processedValue: string
}

/** REQUEST */

export interface GetSourceDetailRequest {
  sourceId: string
  sourceType: SourceTypeEnum
}

// 请求和响应类型定义
export interface GetTableInfoRequest {
  tableId: string
  conversationId: string
}

export interface GetSheetInfoRequest {
  sheetId: number
}

export interface GetSheetColumnsRequest {
  sheetId: number
}

export interface GetSheetAllRowIdsRequest {
  sheetId: number
}

export interface GetRowsDetailRequest {
  rowIds: string[]
}

// 操作请求和响应
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
  // 这里的逻辑有点恶心，是为了方便以后拓展使用额外字段
  tool: { [key in AiToolEnum]: {} }

  promptPattern: string // prompt 对应的列的内容
  enableAutoUpdate: boolean
}

export interface GetAiInsertColumnParamRequest {
  columnId: string
}

export interface AddSheetRequest {
  sheetName: string
  tableId: string
}

export interface DeleteSheetRequest {
  sheetId: number
}
export interface UpdateSheetRequest {
  sheetId: number
  sheetName: string
}

// 更新表格名接口
export interface UpdateTableNameRequest {
  tableId: string
  tableName: string
}

// 表格文件下载接口
export interface DownloadSheetRequest {
  sheetId: number
  // 可选的筛选条件
  filters?: {
    columnId: string
    filterType: number
    filterValue: string
  }[]
  // 可选的排序条件
  sort?: {
    columnId: string
    sortType: 'asc' | 'desc'
  }
}

export interface GetCellsStatusRequest {
  cellIds: string[]
  sheetId: number
}

/** RESPONSE */

export interface GetTableInfoResponse {
  sheetInfos: Sheet[] // TODO 待后端更改属性名称
  tableName: string
}

export interface GetSourceDetailResponse {
  cdeDescription: string
  cdeFilterCondition: string
  cdeFilterID: string
  createTime: string
  sourceId: string
  type: SourceTypeEnum
  updateTime: string
  answer: string
  columnName: string
  model: number
  progress: string
  promptPattern: string
  question: string
  rawSentenceID: string
  selectTools: { [key: string]: unknown }
  source: string
  indicatorFilterId?: number
  indicatorId?: string
  indicatorFilterDetail?: string
  rawSentence?: string
  rawSentenceId?: string
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
  result?: any
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
    status: ProgressStatusEnum
  }[]
}

export interface GetAiInsertColumnParamResponse {
  aiModel: AiModelEnum
  columnId: string
  prompt: string
  promptPattern: string
  tool: { [key: string]: {} } // 根据示例，tool的key是字符串类型的数字
}

export interface AddSheetResponse {
  data: number // sheetId
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
  cells: CellStatusItem[]
}
