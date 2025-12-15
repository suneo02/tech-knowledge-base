import { XRequest } from '@ant-design/x'
import { chatApiPathMap, WIND_ENT_CHAT_PATH, WindSessionHeader } from 'gel-api'
import path from 'path-browserify'

// Define the API endpoint key as a constant
const CHAT_RESULT_ENDPOINT: keyof chatApiPathMap = 'chat/getResult'

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
  return XRequest({
    baseURL: baseUrl,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, {
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

export type XRequestClass = ReturnType<typeof XRequest>
