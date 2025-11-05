import { ApiResponseForWFC } from '../type'
import { AddDataToSheetRequest } from './addDataToSheet'
import {
  AddSheetRequest,
  AddSheetResponse,
  AiInsertColumnRequest,
  AiInsertColumnResponse,
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
} from './type'

export interface wfcSuperApiPathMap {
  'superlist/excel/addDataToSheet': {
    data: AddDataToSheetRequest
    response: ApiResponseForWFC<{
      data: { sheetId: number; sheetName: string }[]
    }>
  }
  'superlist/excel/getTableInfo': {
    data: GetTableInfoRequest
    response: ApiResponseForWFC<GetTableInfoResponse>
  }
  'superlist/excel/sourceDetail': {
    data: GetSourceDetailRequest
    response: ApiResponseForWFC<GetSourceDetailResponse>
  }
  'superlist/excel/getSheetInfo': {
    data: GetSheetInfoRequest
    response: ApiResponseForWFC<GetSheetInfoResponse>
  }
  'superlist/excel/getSheetColumns': {
    data: GetSheetColumnsRequest
    response: ApiResponseForWFC<GetSheetColumnsResponse>
  }
  'superlist/excel/getSheetAllRowIds': {
    data: GetSheetAllRowIdsRequest
    response: ApiResponseForWFC<GetSheetAllRowIdsResponse>
  }
  'superlist/excel/getRowsDetail': {
    data: GetRowsDetailRequest
    response: ApiResponseForWFC<GetRowsDetailResponse>
  }
  'superlist/excel/operation': {
    data: TableOperationRequest
    response: ApiResponseForWFC<TableOperationResponse>
  }
  /**
   * WFC AI生成列（原智能填充）
   */
  'superlist/excel/aiInsertColumn': {
    data: AiInsertColumnRequest
    response: ApiResponseForWFC<AiInsertColumnResponse>
  }

  /**
   * WFC 获取AI生成列参数
   */
  'superlist/excel/getAiInsertColumnParam': {
    data: GetAiInsertColumnParamRequest
    response: ApiResponseForWFC<GetAiInsertColumnParamResponse>
  }

  /**
   * WFC 新增sheet
   */
  'superlist/excel/addSheet': {
    data: AddSheetRequest
    response: ApiResponseForWFC<AddSheetResponse>
  }
  /**
   * WFC 删除sheet
   */
  'superlist/excel/deleteSheet': {
    data: DeleteSheetRequest
    response: ApiResponseForWFC<DeleteSheetResponse>
  }
  /**
   * WFC 更新sheet
   */
  'superlist/excel/updateSheet': {
    data: UpdateSheetRequest
    response: ApiResponseForWFC<UpdateSheetResponse>
  }
  /**
   * WFC 更新表格名称
   */
  'superlist/excel/updateTableName': {
    data: UpdateTableNameRequest
    response: ApiResponseForWFC<UpdateTableNameResponse>
  }
  /**
   * WFC 下载表格
   */
  'superlist/excel/downloadSheet': {
    data: DownloadSheetRequest
    response: ApiResponseForWFC<DownloadSheetResponse>
  }

  /**
   * WFC 查询当前 sheet 指标信息
   */
  'superlist/excel/selectedIndicator': {
    data: {
      sheetId: number
    }
    response: ApiResponseForWFC<{
      indicatorKeyList: string[]
    }>
  }

  /**
   * 获取单元格任务状态
   */
  'superlist/excel/getCellsStatus': {
    data: GetCellsStatusRequest
    response: ApiResponseForWFC<GetCellsStatusResponse>
  }
}
