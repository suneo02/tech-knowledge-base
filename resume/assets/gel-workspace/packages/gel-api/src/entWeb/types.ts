import { RequestMethod } from '@/types/common'
import { AxiosRequestConfig } from 'axios'

export interface EntWebApiResponse<T = unknown> {
  data: T
  errorCode: string
  errorMessage: string
  success: boolean
}

export interface EntWebApiParams {
  method?: RequestMethod
}

export interface EntWebApiOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>, EntWebApiParams {}
