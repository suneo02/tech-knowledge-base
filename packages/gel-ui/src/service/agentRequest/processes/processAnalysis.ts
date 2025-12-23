import { CHAT_CONSTANTS } from '@/config'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { getLanBackend } from '@/utils'
import {
  AnalysisEngineResponse,
  ApiResponseForChat,
  ChatQuestionStatus,
  KnownError,
  requestToChatWithAxios,
} from 'gel-api'
import { createHandleError, createHandleErrorFromContext } from '../helper'
import { ChatRunContext } from '../runContext'

/**
 * 意图分析处理函数 - 纯函数实现
 *
 * 主要功能：
 * 1. 调用 analysisEngine 进行意图分析
 * 2. 处理分析结果和错误
 * 3. 更新上下文状态
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */
export async function processAnalysis<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<void> {
  const { staticCfg, input, runtime, abortController } = context
  const { axiosInstance } = staticCfg
  const { content: message } = input
  const { chatId } = runtime

  if (!axiosInstance) {
    throw new Error('axiosInstance is required in processAnalysis')
  }

  // 事件：分析开始
  context.eventBus?.emit('analysis:start', {
    message,
    chatId,
    input: context.input,
    runtime: context.runtime,
  })

  // 直接调用 requestToChatWithAxios
  let analysisResult: AnalysisEngineResponse | null = null
  try {
    // 去除 content 字段，只传递其他字段
    const { content, ...inputWithoutContent } = input

    const response = await requestToChatWithAxios(
      axiosInstance,
      'chat/analysisEngine',
      {
        lang: getLanBackend(),
        body: {
          ...CHAT_CONSTANTS.DEFAULT_ANALYSIS_PARAMS,
          searchword: message,
          ...inputWithoutContent,
          chatId,
        },
        clientType: input.clientType,
      },
      {
        signal: abortController?.signal,
      }
    )
    analysisResult = response.result || null
  } catch (error) {
    // 事件：分析错误
    context.eventBus?.emit('analysis:error', {
      error: error as Error,
      input: context.input,
      runtime: context.runtime,
    })

    const { errorCode, data } = error as KnownError<ApiResponseForChat<AnalysisEngineResponse>>
    throw createHandleError({
      chatId,
      rawSentenceID: data?.result?.rawSentenceID,
      rawSentence: message,
      errorCode:
        (abortController?.signal?.aborted ? ChatQuestionStatus.CANCELLED : (errorCode as ChatQuestionStatus)) ||
        ChatQuestionStatus.FAILED,
    })
  }

  if (!analysisResult) {
    throw createHandleErrorFromContext(context, ChatQuestionStatus.FAILED)
  }

  // 提取有用的字段
  const { itResult = { it: '', rewrite_sentence: '' } } = analysisResult
  const { it = '', rewrite_sentence = '' } = itResult

  // 更新运行时状态 - AnalysisEngine 后可能修改的字段
  // 使用类方法确保外部监听器能收到状态变更
  context.updateRuntime({
    rawSentenceID: analysisResult.rawSentenceID,
    chatId: analysisResult.chatId, // AnalysisEngine 可能返回新的 chatId
    it: it || undefined, // 只在有值时存储
    rewriteSentence: rewrite_sentence || undefined, // 只在有值时存储
  })

  // 事件：分析成功
  context.eventBus?.emit('analysis:success', {
    result: analysisResult,
    input: context.input,
    runtime: context.runtime,
  })
}
