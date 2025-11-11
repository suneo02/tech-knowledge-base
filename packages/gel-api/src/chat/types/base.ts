import { ChatDPUResponse } from './dpu'
import { GelData } from './gelData'
import { ChatModelTypeIdentifier } from './identfiers'
import { ChatRAGResponse } from './rag'
import { ReportChatData } from './report'
import { SplTable } from './spl'

/**
 * @deprecated 接口不规范
 */
export interface ApiResponseForChat<T> extends ChatModelTypeIdentifier {
  result?: T
  message?: string
  status?: string
  ErrorCode?: number | string
}

/**
 * @deprecated 接口不规范
 */
export interface ApiResponseForGetUserQuestion<T> extends ChatModelTypeIdentifier {
  result?: T
  message?: string
  finish?: boolean
  suggest?: ChatRAGResponse
  content?: ChatDPUResponse
  reportData?: ReportChatData
  splTable?: SplTable[]
  /**
   * reportProgress
: 
{currentStepCode: "TEMPLATE_CONFIRMED", currentStepName: "模板已确认", progressPercentage: 25}
   */
  reportProgress: {
    currentStepCode: string
    currentStepName: string
    progressPercentage: number
  }
  Data?: T
  status?: string
  gelData?: GelData[]
  ErrorCode?: number | string
}
