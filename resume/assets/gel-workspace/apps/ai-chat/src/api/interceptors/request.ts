import { getWsidDevProd } from '@/utils/env'
import { InternalAxiosRequestConfig } from 'axios'
import { WindSessionHeader } from 'gel-api'
import { getCurrentLanguage } from '@/utils/langSource'

// 请求拦截器
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // 动态获取 session ID
  const wsid = getWsidDevProd()
  if (wsid) {
    config.headers[WindSessionHeader] = wsid
  }

  // 统一附加语言参数：英文版本时追加 lang=en（不覆盖显式传入）
  try {
    const lan = getCurrentLanguage()
    if (lan === 'en') {
      const existingParams = (config.params || {}) as Record<string, unknown>
      if (existingParams.lang === undefined) {
        config.params = { ...existingParams, lang: 'en' } as any
      }
    }
  } catch (_) {
    // 忽略语言检测异常，保持请求不中断
  }

  return config
}

// 请求错误拦截器
export const requestErrorInterceptor = (error: Error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
}
