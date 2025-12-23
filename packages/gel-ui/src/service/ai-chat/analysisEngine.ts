import { CHAT_CONSTANTS } from '@/config'
import { ChatSenderOptions } from '@/types'
import { getLanBackend } from '@/utils'
import { AxiosInstance } from 'axios'
import {
  AnalysisEngineResponse,
  ApiResponseForChat,
  ChatQuestionStatus,
  KnownError,
  requestToChatWithAxios,
} from 'gel-api'
import { createHandleError } from '../agentRequest/helper'

export type AnalysisEngineOptions = {
  isDev?: boolean
  chatId: string
  message: string
  senderOptions?: ChatSenderOptions
  signal?: AbortSignal
}
/**
 * 意图分析
 * @param chatId 聊天ID
 * @param message 用户消息
 * @param options 选项参数
 * @param signal 中止信号
 * @returns 分析结果
 */
export const analysisEngine = async (axiosInstance: AxiosInstance, options: AnalysisEngineOptions) => {
  const { isDev, chatId, message, senderOptions, signal } = options
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
          ...senderOptions,
        },
        clientType: senderOptions?.clientType,
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
      errorCode:
        (signal?.aborted ? ('-1' as ChatQuestionStatus) : (errorCode as ChatQuestionStatus)) ||
        ('0' as ChatQuestionStatus),
    })
  }
}
