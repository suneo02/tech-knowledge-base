import { KnownError } from '@/types'
import { getLanBackend } from '@/util'
import { AxiosInstance } from 'axios'
import { AnalysisEngineResponse, ApiResponseForChat, requestToChatWithAxios } from 'gel-api'
import { CHAT_CONSTANTS, ChatSenderOptions } from '../types'
import { createHandleError } from '@/hooks/useChat/helpers/chatHelpers'

/**
 * 意图分析
 * @param chatId 聊天ID
 * @param message 用户消息
 * @param options 选项参数
 * @param signal 中止信号
 * @returns 分析结果
 */
export const analysisEngine = async (
  axiosInstance: AxiosInstance,
  isDev = false,
  chatId: string,
  message: string,
  options?: ChatSenderOptions,
  signal?: AbortSignal
) => {
  try {
    const response = await requestToChatWithAxios(
      axiosInstance,
      'chat/analysisEngine',
      {
        lang: getLanBackend(),
        body: {
          ...CHAT_CONSTANTS.DEFAULT_ANALYSIS_PARAMS,
          chatId,
          searchword: message,
          ...options,
          think: options?.think || undefined,
          entityType: options?.entityType || undefined,
          entityName: options?.entityName || undefined,
        },
      },
      {
        signal: signal,
      }
    )
    return response.result
  } catch (error) {
    console.log('🚀 ~ analysisEngine  error:', error)
    const { errorCode, data } = error as KnownError<ApiResponseForChat<AnalysisEngineResponse>>
    throw createHandleError({
      chatId,
      // @ts-expect-error ttt
      rawSentenceID: isDev ? data?.result?.rawSentenceID || data?.rawSentenceID : data?.result?.rawSentenceID,
      rawSentence: message,
      errorCode: (signal?.aborted ? '-1' : errorCode) || '0',
    })

  }
}
