import { ApiCodeForWfc } from './code'

export interface KnownError<T> {
  errorCode: string
  errorMessage: string
  data?: T
}

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

export interface ApiResponseForTable<T> {
  result: {
    pagination: {
      total: number
      current: number
      pageSize: number
    }
    data: T // 所有的数据放这里面
  }
  Data?: T
  message: string // 失败对应的消息提示
  code: number // 200 默认成功
}
