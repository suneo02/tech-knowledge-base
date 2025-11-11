import { ApiResponseForChat } from '@/chat'
import { ApiResponseForWFC } from '@/types'
import {
  GenerateColumnNameRequest,
  GenerateColumnNameResponse,
  RunCellRequest,
  RunCellResponse,
  RunColumnRequest,
  RunColumnResponse,
} from './type'

export * from '../../wfc/super/domains/sheet/addDataToSheet'
export * from './type'
// 基础类型定义

export interface superlistExcelApiPathMap {
  /**
   * 执行单元格任务
   */
  'excel/runCell': {
    data: RunCellRequest
    response: ApiResponseForChat<RunCellResponse>
  }
  /**
   * 执行列任务
   */
  'excel/runColumn': {
    data: RunColumnRequest
    response: ApiResponseForChat<RunColumnResponse>
  }

  /**
   * 生成列名
   */
  'intelligentFill/generateColumnName': {
    data: GenerateColumnNameRequest
    response: ApiResponseForWFC<GenerateColumnNameResponse>
  }
}
