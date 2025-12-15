import { getWsidProd } from 'gel-util/env'
import { type InternalAxiosRequestConfig } from 'axios'
import { WindSessionHeader } from 'gel-api'
import { isEn } from 'gel-util/locales'

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 动态获取 session ID
  const wsid = getWsidProd()
  if (wsid) {
    config.headers[WindSessionHeader] = wsid
  }

  // 统一附加语言参数：英文版本时追加 lang=en（不覆盖显式传入）
  try {
    const lan = isEn()
    if (lan) {
      const existingParams = (config.params || {}) as Record<string, unknown>
      if (existingParams.lang === undefined) {
        config.params = { ...existingParams, lang: 'en' } as Record<string, unknown>
      }
    }
  } catch {
    // 忽略语言检测异常，保持请求不中断
  }

  return config
}

// 请求错误拦截器
export const requestErrorInterceptor = (error: Error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
}
