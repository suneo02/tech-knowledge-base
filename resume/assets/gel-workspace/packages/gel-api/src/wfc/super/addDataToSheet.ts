import { getCDEFilterResPayload } from '@/windSecure'
import { AddClueExcelDataToSheetRequest } from '../../superlist/chat'

export interface AddIndicatorDataToSheetRequest {
  tableId: string
  /**
   * @deprecated 后续后端会处理
   */
  sheetId?: number
  dataType: 'INDICATOR_FILTER'
  classificationList: {
    id: number
    rootName: string
    displayName: string
    indicators: {
      spId: number
      displayName: string
    }[]
  }[]
  pageNo: number
  pageSize: number
}

export interface AddDpuDataToSheetRequest {
  tableId: string
  sheetId?: number
  sheetName?: string
  dataType: 'AI_CHAT_DPU'
  chatId: string
  rawSentenceID: string
  rawSentence: string
  answers?: string
  dpuHeaders: any[]
  dpuContent: any[][]
  enablePointConsumption?: 1 | 0 // TODO:开启积分的测试流程, @耿坤元要求，后续删除
}

export interface AddCdeDataToSheetRequest {
  tableId: string
  sheetId?: number
  dataType: 'CDE_FILTER'
  cdeDescription: string
  cdeFilterCondition: getCDEFilterResPayload
  enablePointConsumption?: 1 | 0 // TODO:开启积分的测试流程, @耿坤元要求，后续删除
}

export interface AddBulkImportDataToSheetRequest extends Pick<AddClueExcelDataToSheetRequest, 'clueExcelCondition'> {
  tableId: string
  sheetId: number
  dataType: 'CLUE_EXCEL'
  enablePointConsumption?: 1 | 0 // TODO:开启积分的测试流程, @耿坤元要求，后续删除
}

export type AddDataToSheetRequest =
  | AddIndicatorDataToSheetRequest
  | AddDpuDataToSheetRequest
  | AddCdeDataToSheetRequest
  | AddBulkImportDataToSheetRequest
