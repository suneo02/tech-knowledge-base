import type { ChatSendInput } from '@/types/ai-chat-perf'
import { getLanBackend } from '@/utils'
import { requestToChatWithAxios } from 'gel-api'
import { ChatRunContext } from '../runContext'

/**
 * 数据召回处理函数 - 纯函数实现
 *
 * 主要功能：
 * 1. 根据分析结果进行数据召回
 * 2. 处理数据检索错误（不影响主流程）
 * 3. 执行数据召回请求
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */
export async function processDataRetrieval<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<void> {
  const { staticCfg, input, runtime, abortController } = context
  const { axiosInstance } = staticCfg
  const { chatId, rawSentenceID, it, rewriteSentence } = runtime

  if (!rawSentenceID) {
    // No rawSentenceID found, skipping data retrieval
    return
  }

  // 事件：数据召回开始
  context.eventBus?.emit('dataRetrieval:start', {
    chatId,
    rawSentenceID,
    input: context.input,
    runtime: context.runtime,
  })

  try {
    // 直接调用 requestToChatWithAxios 进行数据召回
    await requestToChatWithAxios(
      axiosInstance,
      'chat/queryReference',
      {
        body: {
          callGLMType: '3',
          aigcStreamFlag: '1',
          transLang: getLanBackend(),
          version: 1,
          // 从 input 中获取其他参数
          ...input,
          chatId,
          rawSentenceID,
          rawSentence: input.content,
          searchword: rewriteSentence || '',
          it: it || '',
        },
        lang: getLanBackend(),
        source: 3,
      },
      {
        signal: abortController?.signal,
      }
    )

    // 事件：数据召回成功
    context.eventBus?.emit('dataRetrieval:success', {
      input: context.input,
      runtime: context.runtime,
    })
  } catch (error) {
    // 事件：数据召回错误
    context.eventBus?.emit('dataRetrieval:error', {
      error: error as Error,
      input: context.input,
      runtime: context.runtime,
    })

    // 数据召回失败不影响主流程，只记录错误
    // 不抛出错误，让主流程继续
  }
}
