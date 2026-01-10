import { XRequest } from '@ant-design/x'
import { chatApiPathMap, WIND_ENT_CHAT_PATH, WindSessionHeader } from 'gel-api'
import { isEn } from 'gel-util/intl'
import path from 'path-browserify'

// Define the API endpoint key as a constant
const CHAT_RESULT_ENDPOINT: keyof chatApiPathMap = 'chat/getResult'

// Normalize fetch input to string for environments where hooks assume string URLs
const normalizeFetchInput = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url
  return String(input)
}

/**
 * 创建配置了基础设置的 XRequest 实例
 */
export const createConfiguredXRequest = (
  getSignal: (() => AbortSignal | undefined) | AbortSignal | undefined,
  wsid: string,
  apiPrefix: string
): ReturnType<typeof XRequest> => {
  let baseUrl = ''
  if (!apiPrefix) {
    baseUrl = path.join(WIND_ENT_CHAT_PATH, CHAT_RESULT_ENDPOINT)
  } else {
    baseUrl = path.join(apiPrefix, WIND_ENT_CHAT_PATH, CHAT_RESULT_ENDPOINT)
  }

  try {
    return XRequest({
      baseURL: baseUrl,
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        let finalInput: RequestInfo | URL = input

        // 尝试添加语言参数，失败时降级为不添加
        try {
          let url: URL
          if (typeof input === 'string') {
            url = new URL(input, window.location.origin)
          } else if (input instanceof URL) {
            url = new URL(input.toString())
          } else {
            url = new URL(input.url, window.location.origin)
          }

          // 英文环境下添加 lang=en 参数（不覆盖已有参数）
          if (isEn() && !url.searchParams.has('lang')) {
            url.searchParams.set('lang', 'en')
          }

          finalInput = url
        } catch (error) {
          // 语言参数处理失败时，使用原始 input，保持请求不中断
          console.error('[XRequest] Failed to add language parameter:', error)
        }

        const requestUrl = normalizeFetchInput(finalInput)

        return fetch(requestUrl, {
          ...init,
          headers: {
            ...init?.headers,
            [WindSessionHeader]: wsid,
          },
          signal: typeof getSignal === 'function' ? getSignal() : getSignal,
        })
      },
    })
  } catch (error) {
    // 整个增强逻辑失败时，降级为原始逻辑
    console.error('[XRequest] Failed to create enhanced XRequest, falling back to basic configuration:', error)
    return XRequest({
      baseURL: baseUrl,
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const requestUrl = normalizeFetchInput(input)

        return fetch(requestUrl, {
          ...init,
          headers: {
            ...init?.headers,
            [WindSessionHeader]: wsid,
          },
          signal: typeof getSignal === 'function' ? getSignal() : getSignal,
        })
      },
    })
  }
}

export type XRequestClass = ReturnType<typeof XRequest>
