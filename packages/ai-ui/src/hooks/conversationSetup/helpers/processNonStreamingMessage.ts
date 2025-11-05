import { KnownError } from '@/types'
import { NEW_WORKFLOW } from '@/util'
import { AxiosInstance } from 'axios'
import { AnalysisEngineResponse, ApiResponseForChat } from 'gel-api'
import { ChatSenderOptions, ChatSenderRes } from '../types'
import { analysisEngine } from './analysisEngine'
import { handleDataRetrieval } from './dataRetrieval'
import { questionDisassembly } from './questionDisassembly'
import { createHandleError } from '@/hooks/useChat/helpers/chatHelpers'

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
 * @param onTitleSummaryFinish 刷新会话列表的回调函数
 * @returns 处理后的消息结果
 */

export const processNonStreamingMessage = async (
  axiosInstance: AxiosInstance,
  isDev = false,
  chatId: string,
  message: string,
  onReciveQuestion?: (question: string[]) => void,
  options?: ChatSenderOptions,
  signal?: AbortSignal,
  onTitleSummaryFinish?: () => void,
  clientType?: 'superlist'
): Promise<ChatSenderRes> => {
  // 意图失败就不用上报了
  const { rawSentenceID, itResult = { it: '', rewrite_sentence: '' } } = await analysisEngine(
    axiosInstance,
    isDev,
    chatId,
    message,
    options,
    signal
  )
  const { it = '', rewrite_sentence = '' } = itResult

  try {
    // 是否是新的异步流程，测试用，整体切换完去掉
    if (NEW_WORKFLOW) {
      //
      await handleDataRetrieval(
        axiosInstance,
        {
          chatId,
          rawSentenceID,
          rawSentence: message,
          searchword: rewrite_sentence || '',
          it,
          think: options?.think || 0,
          ...options,
        },
        signal,
        clientType
      )

      // 使用 Promise 来处理问句拆解
      return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
          try {
            const res = await questionDisassembly(axiosInstance, message, rawSentenceID, signal)
            const { content, result, suggest, gelData } = res
            if (result && typeof result === 'string' && onReciveQuestion) {
              onReciveQuestion(result?.split('\n'))
            }
            if (res.finish) {
              clearInterval(timer)
              resolve({
                rawSentenceID,
                searchword: message,
                gelData,
                chatId,
                suggest,
                content,
                refTable: content?.data,
                chartType: content?.chart,
              } as unknown as ChatSenderRes)
            }
          } catch (error) {
            console.error('问句拆解失败:', error)
            clearInterval(timer)
            // 问句拆解失败不影响主流程，仍然resolve
            resolve({
              chatId,
              rawSentence: message,
              rawSentenceID,
              searchword: rewrite_sentence || '',
              gelData: [],
              refTable: undefined,
              chartType: undefined,
              suggest: undefined,
            } as unknown as ChatSenderRes)
          }
        }, 3000)

        // 如果 signal 被中止，清理定时器
        if (signal) {
          signal.addEventListener('abort', () => {
            clearInterval(timer)
            console.error('请求被中止，清理定时器')
            reject(createHandleError({
              chatId,
              rawSentenceID,
              rawSentence: message,
              errorCode: '-1',
            }))
          })
        }
      })
    } else {
      // 同时发送数据召回和问句拆解接口
      const dataRetrievalPromise = handleDataRetrieval(
        axiosInstance,
        {
          chatId,
          rawSentenceID,
          rawSentence: message,
          searchword: rewrite_sentence,
          it,
          ...options,
        },
        signal,
        clientType
      )

      // 问句拆解接口，不阻塞主流程
      questionDisassembly(axiosInstance, message, rawSentenceID, signal)
        .then((res) => {
          const { result } = res
          if (result && onReciveQuestion) {
            // 如果问句拆解成功，调用回调函数
            onReciveQuestion(result?.split('\n'))
          }
        })
        .catch((error) => {
          console.error('问句拆解失败:', error)
          // 问句拆解失败不影响主流程
        })
      // 等待数据召回完成
      const { result = { suggest: {}, content: { data: [] } }, gelData } = await dataRetrievalPromise
      const { content, suggest } = result

      // 返回数据召回的结果
      return {
        ...result,
        searchword: message,
        rawSentenceID,
        suggest,
        chatId,
        gelData,
        refTable: content?.data,
        // @ts-expect-error 111
        chartType: content?.chart,
      } as ChatSenderRes
    }
  } catch (error) {
    console.error('数据召回&问句拆解失败:', signal, error, [error])
    const { errorCode } = error as KnownError<ApiResponseForChat<AnalysisEngineResponse>>

    throw createHandleError({
      chatId,
      rawSentenceID,
      rawSentence: message,
      errorCode: (signal?.aborted ? '-1' : errorCode) || '0',
    })
  }
}
