import { XRequest } from '@ant-design/x'
import { chatApiPathMap, WIND_ENT_CHAT_PATH, WindSessionHeader } from 'gel-api'
import path from 'path-browserify'

// Define the API endpoint key as a constant
const CHAT_RESULT_ENDPOINT: keyof chatApiPathMap = 'chat/getResult'

export type XRequestClass = ReturnType<typeof createConfiguredXRequest>

/**
 * 创建配置了基础设置的 XRequest 实例
 */
export const createConfiguredXRequest = (
  getSignal: (() => AbortSignal | undefined) | AbortSignal | undefined,
  wsid: string,
  baseUrl: string
) =>
  XRequest({
    baseURL: path.join(baseUrl, WIND_ENT_CHAT_PATH, CHAT_RESULT_ENDPOINT),
    fetch: async (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          [WindSessionHeader]: wsid,
        },
        signal: typeof getSignal === 'function' ? getSignal() : getSignal,
      }),
  })
