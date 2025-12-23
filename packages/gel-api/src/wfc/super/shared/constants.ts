/**
 * Super 模块相关常量
 */

/**
 * 表格操作命令类型
 */
export const OPERATION_COMMANDS = {
  UPDATE_CELL: 'update_cell',
  RUN_CELL: 'run_cell',
  UPDATE_COLUMN: 'update_column',
  MOVE_COLUMN: 'move_column',
  ADD_COLUMN: 'add_column',
  DELETE_COLUMN: 'delete_column',
  RENAME_COLUMN: 'rename_column',
  RUN_COLUMN: 'run_column',
  FILTER_COLUMN: 'filter_column',
  SORT_COLUMN: 'sort_column',
  HIDE_COLUMN: 'hide_column',
  DELETE_ROW: 'delete_row',
  ADD_ROW: 'add_row',
  RUN_ROW: 'run_row',
  UNDO: 'undo',
  REDO: 'redo',
} as const

/**
 * 排序类型
 */
export const SORT_TYPES = {
  ASC: 'asc',
  DESC: 'desc',
} as const

/**
 * Sheet 相关 API 路径常量
 */
const SUPER_API_SHEET_PATHS = {
  ADD_DATA_TO_SHEET: 'superlist/excel/addDataToSheet',
  CUSTOMER_POINT_COUNT_BY_AI_COLUMN: 'superlist/excel/customerPointCountByAIColumn',
  CUSTOMER_POINT_COUNT_BY_COLUMN_INDICATOR: 'superlist/excel/customerPointCountByColumnIndicator',
  GET_TABLE_INFO: 'superlist/excel/getTableInfo',
  SOURCE_DETAIL: 'superlist/excel/sourceDetail',
  GET_SHEET_INFO: 'superlist/excel/getSheetInfo',
  GET_SHEET_COLUMNS: 'superlist/excel/getSheetColumns',
  GET_SHEET_ALL_ROW_IDS: 'superlist/excel/getSheetAllRowIds',
  GET_ROWS_DETAIL: 'superlist/excel/getRowsDetail',
  OPERATION: 'superlist/excel/operation',
  AI_INSERT_COLUMN: 'superlist/excel/aiInsertColumn',
  GET_AI_INSERT_COLUMN_PARAM: 'superlist/excel/getAiInsertColumnParam',
  ADD_SHEET: 'superlist/excel/addSheet',
  DELETE_SHEET: 'superlist/excel/deleteSheet',
  UPDATE_SHEET: 'superlist/excel/updateSheet',
  UPDATE_TABLE_NAME: 'superlist/excel/updateTableName',
  DOWNLOAD_SHEET: 'superlist/excel/downloadSheet',
  SELECTED_INDICATOR: 'superlist/excel/selectedIndicator',
  GET_CELLS_STATUS: 'superlist/excel/getCellsStatus',
} as const

/**
 * 订阅相关 API 路径常量
 */
const SUPER_API_SUBSCRIPTION_PATHS = {
  GET_SUB_SUPER_LIST_CRITERION: 'superlist/excel/getSubSuperListCriterion',
  UPDATE_SUB_SUPER_LIST_CRITERION: 'superlist/excel/updateSubSuperListCriterion',
  GET_CDE_NEW_COMPANY: 'superlist/excel/getCdeNewCompany',
  DISABLE_CDE_NEW_COMPANY_NOTICE: 'superlist/excel/disableCdeNewCompanyNotice',
} as const

/**
 * 聚合所有 API 路径常量
 */
export const SUPER_API_PATHS = {
  // Sheet 相关
  ...SUPER_API_SHEET_PATHS,
  // 订阅相关
  ...SUPER_API_SUBSCRIPTION_PATHS,
} as const
