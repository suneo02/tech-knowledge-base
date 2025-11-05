import { GelData } from '../paths'

export * from './agent'

export type LanBackend = 'CHS' | 'ENS'

export type ChatThinkSignal = {
  think: 1 | undefined
}

export type ChatReviewSignal = {
  review: 1 | undefined
}

export interface ApiResponseForChat<T> {
  result: T
  message: string
  finish?: boolean
  suggest?: string[]
  content?: { data: T; [key: string]: any }
  Data?: T
  status: string
  gelData?: GelData[]
  ErrorCode?: number | string
}
