import { RequestMethod } from './common'
import { ApiResponseForWFC } from './response'

/**
 * Success callback type definition
 */
type SuccessCallback<R> = (response: R) => void

/**
 * Error callback type definition
 */
type ErrorCallback<R = any> = (error: R) => void

/**
 * API request options
 */
export interface RequestConfig<D = Record<string, any>, R = ApiResponseForWFC> {
  method?: RequestMethod
  data?: D
  params?: Record<string, any>
  contentType?: string
  timeout?: number
  success?: SuccessCallback<R>
  error?: ErrorCallback
  finish?: (response: R | null, error?: any) => void
}
