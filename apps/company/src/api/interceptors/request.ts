import type { InternalAxiosRequestConfig } from 'axios'
import { WindSessionHeader } from 'gel-api'
import { getWsid } from '@/utils/env'

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 动态获取 session ID
  const wsid = getWsid()
  if (wsid) {
    config.headers[WindSessionHeader] = wsid
  }

  return config
}

// 请求错误拦截器
export const requestErrorInterceptor = (error: Error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
}
