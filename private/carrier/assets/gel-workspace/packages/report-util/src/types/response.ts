import { ApiCodeForWfc } from './code'

export interface ApiPageForWFC {
  CurrentPage: number
  PageSize: number
  Records: number
  TotalPage: number
}

export interface ApiResponseForWFC<T = never> {
  Data?: T
  ErrorCode?: ApiCodeForWfc
  ErrorMessage?: string
  status?: string
  Page?: ApiPageForWFC
}

export interface ApiResponseForBaifen<T = never> {
  data: T
  code: string
  message: string
}
