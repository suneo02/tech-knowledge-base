import { getMainEnv } from '@/config/env'
import { getBaseUrl } from '@/services/request'
import { isDev } from '@/utils/env'
import { XRequest } from '@ant-design/x'
import { chatApiPathMap, WIND_ENT_CHAT_PATH, WindSessionHeader } from 'gel-api'
import { getWSID } from 'gel-util/env'
import path from 'path-browserify'

// Define the API endpoint key as a constant
const CHAT_RESULT_ENDPOINT: keyof chatApiPathMap = 'chat/getResult'

export type XRequestClass = ReturnType<typeof createConfiguredXRequest>

console.log('isDev', isDev, getMainEnv().sessionId)

/**
 * 创建配置了基础设置的 XRequest 实例
 */
export const createConfiguredXRequest = (signal: AbortSignal | undefined) =>
  XRequest({
    baseURL: path.join(getBaseUrl(), WIND_ENT_CHAT_PATH, CHAT_RESULT_ENDPOINT),
    fetch: async (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          [WindSessionHeader]: isDev ? getMainEnv().sessionId : getWSID(isDev),
        },
        signal: signal,
      }),
  })
