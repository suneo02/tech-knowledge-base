import { ChatSenderOptions } from '@/types'
import { AxiosInstance } from 'axios'
import { AnalysisEngineResponse, ApiResponseForChat, ChatClientType, ChatQuestionStatus, KnownError } from 'gel-api'
import { createHandleError } from '../agentRequest/helper/createHandleError'
import { analysisEngine } from './analysisEngine'
import { handleDataRetrieval } from './dataRetrieval'
import { getUserQuestion } from './getUserQuestion'
import { ChatSenderRes } from './saveChatItem'

export type ProcessNonStreamingMessageOptions = {
  isDev?: boolean
  chatId: string
  message: string
  onAnalysisEngineSuccess?: (analysisEngineRes: AnalysisEngineResponse | undefined) => void
  onReciveQuestion?: (question: string[]) => void
  options?: ChatSenderOptions
  signal?: AbortSignal
  clientType?: ChatClientType
  splVersion?: number // 坤元临时方案，我加这里，之后删除
  getUserQuestionInterval?: number
}

/**
 * 处理用户消息，不包括流式输出
 *
 * 1. 分析用户消息
 * 2. 拆解用户消息
 * 3. 处理标题摘要
 * 4. 数据召回
 * 5. 返回结果
 *
 * @param chatId 聊天ID
 * @param message 用户消息
 * @param onReciveQuestion 接收拆解问题的回调函数
 * @param _options 可选参数
 * @param signal 中止信号
 * @returns 处理后的消息结果
 */

export const processNonStreamingMessage = async (
  axiosInstance: AxiosInstance,
  options: ProcessNonStreamingMessageOptions,
  senderOptions?: ChatSenderOptions
): Promise<ChatSenderRes> => {
  const {
    chatId: chatIdParam,
    message,
    onAnalysisEngineSuccess,
    onReciveQuestion,
    signal,
    clientType,
    getUserQuestionInterval = 3000,
  } = options
  let chatIdParsed = chatIdParam
  const analysisEngineRes = await analysisEngine(axiosInstance, {
    ...options,
    senderOptions,
  })
  // 意图失败就不用上报了
  if (!analysisEngineRes) {
    throw createHandleError({
      chatId: chatIdParam,
      rawSentenceID: '',
      rawSentence: message,
      errorCode: ChatQuestionStatus.FAILED,
    })
  }

  if (onAnalysisEngineSuccess) {
    onAnalysisEngineSuccess(analysisEngineRes)
  }
  // 如果 chatId 为空，则使用分析引擎的 chatId，analysisEngine 会自动创建会话
  if (!chatIdParsed) {
    chatIdParsed = analysisEngineRes.chatId
  }

  const { rawSentenceID, itResult = { it: '', rewrite_sentence: '' } } = analysisEngineRes
  const { it = '', rewrite_sentence = '' } = itResult

  try {
    try {
      await handleDataRetrieval(axiosInstance, {
        params: {
          chatId: chatIdParsed,
          rawSentenceID,
          rawSentence: message,
          searchword: rewrite_sentence || '',
          it,
          think: senderOptions?.think || 0,
          ...senderOptions,
        },
        ...options,
      })
    } catch (e) {
      console.error('handleDataRetrieval failed, but continuing execution:', e)
    }

    // 使用 Promise 来处理问句拆解
    return new Promise((resolve, reject) => {
      let timer: ReturnType<typeof setInterval> | null = null

      const handleGetUserQuestion = async () => {
        try {
          const res = await getUserQuestion(
            axiosInstance,
            {
              rawSentence: message,
              rawSentenceID,
              agentId: senderOptions?.agentId,
              clientType,
              think: senderOptions?.think,
              deepSearch: senderOptions?.deepSearch,
            },
            signal
          )

          const { content, result, suggest, gelData, splTable, reportData, modelType } = res
          if (result && typeof result === 'string' && onReciveQuestion) {
            onReciveQuestion(result?.split('\n'))
          }
          if (res.finish) {
            if (timer) clearInterval(timer)
            resolve({
              rawSentenceID,
              searchword: message,
              gelData,
              chatId: chatIdParsed,
              suggest,
              content,
              dpuList: content?.data,
              chartType: content?.chart,
              splTable,
              modelType,
              reportData,
            })
          }
        } catch (error) {
          console.error('问句拆解失败:', error)
          if (timer) clearInterval(timer)
          // 问句拆解失败不影响主流程，仍然resolve
          resolve({
            chatId: chatIdParsed,
            rawSentence: message,
            rawSentenceID,
            searchword: rewrite_sentence || '',
            gelData: [],
            splTable: [],
            dpuList: [],
            chartType: undefined,
            suggest: undefined,
          })
        }
      }

      // 立即执行第一次调用
      handleGetUserQuestion()

      // 设置定时器进行后续轮询
      timer = setInterval(handleGetUserQuestion, getUserQuestionInterval)

      // 如果 signal 被中止，清理定时器
      if (signal) {
        signal.addEventListener('abort', () => {
          if (timer) clearInterval(timer)
          console.error('请求被中止，清理定时器')
          reject(
            createHandleError({
              chatId: chatIdParsed,
              rawSentenceID,
              rawSentence: message,
              errorCode: ChatQuestionStatus.CANCELLED,
            })
          )
        })
      }
    })
  } catch (error) {
    console.error('问句拆解流程失败:', signal, error, [error])
    const { errorCode } = error as KnownError<ApiResponseForChat<AnalysisEngineResponse>>

    throw createHandleError({
      chatId: chatIdParsed,
      rawSentenceID,
      rawSentence: message,
      errorCode:
        (signal?.aborted ? ChatQuestionStatus.CANCELLED : (errorCode as ChatQuestionStatus)) ||
        ChatQuestionStatus.FAILED,
    })
  }
}
