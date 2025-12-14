import { AxiosRequestConfig } from 'axios'

// 请求配置
export interface RequestConfig<TParams = void> extends AxiosRequestConfig {
  params?: TParams
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

// 请求错误
export interface RequestError extends Error {
  code?: string
  status?: number
  data?: any
}
