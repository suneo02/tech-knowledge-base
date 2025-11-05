import { CorpEvent, CorpEventType } from 'gel-types'

// 合并所有类型
export type EventType = CorpEventType

export type ICorpEvent = CorpEvent

export interface GetCorpEventParams {
  foldType?: string
  companyCode: string
  category?: string
  requestFrom?: string
  endDate: string
  dateRange: number
  type: number
}
