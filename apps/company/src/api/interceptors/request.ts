import { getWsid } from '@/utils/env'
import { AxiosInstance } from 'axios'
import { WindSessionHeader } from 'gel-api'

// 请求拦截器
export const requestInterceptor: Parameters<AxiosInstance['interceptors']['request']['use']>[0] = (config) => {
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
