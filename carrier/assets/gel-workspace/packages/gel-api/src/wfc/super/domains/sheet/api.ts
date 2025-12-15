import { ApiResponseForWFC } from '@/types'
import { SUPER_API_PATHS } from '../../shared/constants'
import { AddDataToSheetRequest, AddDataToSheetResponse } from './addDataToSheet'
import {
  AddSheetRequest,
  AddSheetResponse,
  AiInsertColumnRequest,
  AiInsertColumnResponse,
  CustomerPointCountByAiColumnRequest,
  CustomerPointCountByAiColumnResponse,
  CustomerPointCountByColumnIndicatorRequest,
  CustomerPointCountByColumnIndicatorResponse,
  DeleteSheetRequest,
  DeleteSheetResponse,
  DownloadSheetRequest,
  DownloadSheetResponse,
  GetAiInsertColumnParamRequest,
  GetAiInsertColumnParamResponse,
  GetCellsStatusRequest,
  GetCellsStatusResponse,
  GetRowsDetailRequest,
  GetRowsDetailResponse,
  GetSheetAllRowIdsRequest,
  GetSheetAllRowIdsResponse,
  GetSheetColumnsRequest,
  GetSheetColumnsResponse,
  GetSheetInfoRequest,
  GetSheetInfoResponse,
  GetSourceDetailRequest,
  GetSourceDetailResponse,
  GetTableInfoRequest,
  GetTableInfoResponse,
  TableOperationRequest,
  TableOperationResponse,
  UpdateSheetRequest,
  UpdateSheetResponse,
  UpdateTableNameRequest,
  UpdateTableNameResponse,
} from './types'

/**
 * Sheet 领域 API 路径映射
 */
export interface SheetApiPathMap {
  [SUPER_API_PATHS.ADD_DATA_TO_SHEET]: {
    data: AddDataToSheetRequest
    response: ApiResponseForWFC<AddDataToSheetResponse>
  }
  [SUPER_API_PATHS.GET_TABLE_INFO]: {
    data: GetTableInfoRequest
    response: ApiResponseForWFC<GetTableInfoResponse>
  }
  [SUPER_API_PATHS.SOURCE_DETAIL]: {
    data: GetSourceDetailRequest
    response: ApiResponseForWFC<GetSourceDetailResponse>
  }
  [SUPER_API_PATHS.GET_SHEET_INFO]: {
    data: GetSheetInfoRequest
    response: ApiResponseForWFC<GetSheetInfoResponse>
  }
  [SUPER_API_PATHS.GET_SHEET_COLUMNS]: {
    data: GetSheetColumnsRequest
    response: ApiResponseForWFC<GetSheetColumnsResponse>
  }
  [SUPER_API_PATHS.GET_SHEET_ALL_ROW_IDS]: {
    data: GetSheetAllRowIdsRequest
    response: ApiResponseForWFC<GetSheetAllRowIdsResponse>
  }
  [SUPER_API_PATHS.GET_ROWS_DETAIL]: {
    data: GetRowsDetailRequest
    response: ApiResponseForWFC<GetRowsDetailResponse>
  }
  [SUPER_API_PATHS.OPERATION]: {
    data: TableOperationRequest
    response: ApiResponseForWFC<TableOperationResponse>
  }
  [SUPER_API_PATHS.AI_INSERT_COLUMN]: {
    data: AiInsertColumnRequest
    response: ApiResponseForWFC<AiInsertColumnResponse>
  }
  [SUPER_API_PATHS.GET_AI_INSERT_COLUMN_PARAM]: {
    data: GetAiInsertColumnParamRequest
    response: ApiResponseForWFC<GetAiInsertColumnParamResponse>
  }
  [SUPER_API_PATHS.ADD_SHEET]: {
    data: AddSheetRequest
    response: ApiResponseForWFC<AddSheetResponse>
  }
  [SUPER_API_PATHS.DELETE_SHEET]: {
    data: DeleteSheetRequest
    response: ApiResponseForWFC<DeleteSheetResponse>
  }
  [SUPER_API_PATHS.UPDATE_SHEET]: {
    data: UpdateSheetRequest
    response: ApiResponseForWFC<UpdateSheetResponse>
  }
  [SUPER_API_PATHS.UPDATE_TABLE_NAME]: {
    data: UpdateTableNameRequest
    response: ApiResponseForWFC<UpdateTableNameResponse>
  }
  [SUPER_API_PATHS.DOWNLOAD_SHEET]: {
    data: DownloadSheetRequest
    response: ApiResponseForWFC<DownloadSheetResponse>
  }
  [SUPER_API_PATHS.SELECTED_INDICATOR]: {
    data: {
      sheetId: number
    }
    response: ApiResponseForWFC<{
      indicatorKeyList: string[]
    }>
  }
  [SUPER_API_PATHS.GET_CELLS_STATUS]: {
    data: GetCellsStatusRequest
    response: ApiResponseForWFC<GetCellsStatusResponse>
  }
  [SUPER_API_PATHS.CUSTOMER_POINT_COUNT_BY_AI_COLUMN]: {
    data: CustomerPointCountByAiColumnRequest
    response: ApiResponseForWFC<CustomerPointCountByAiColumnResponse>
  }
  [SUPER_API_PATHS.CUSTOMER_POINT_COUNT_BY_COLUMN_INDICATOR]: {
    data: CustomerPointCountByColumnIndicatorRequest
    response: ApiResponseForWFC<CustomerPointCountByColumnIndicatorResponse>
  }
}
