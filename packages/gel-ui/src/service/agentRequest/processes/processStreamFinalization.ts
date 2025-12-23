/**
 * 流式对话完成后的最终处理函数
 *
 * 主要功能：
 * 1. 获取实体数据 (fetchEntities)
 * 2. 获取追踪数据 (fetchTrace)
 * 3. 格式化最终答案 (formatAIAnswerFull)
 * 4. 保存对话记录 (saveChatItem)
 * 5. 通知上层完成
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */

import { AgentMsgAIDepre } from '@/types'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { ChatEntityRecognize, ChatQuestionStatus } from 'gel-api'
import { ChatRunContext } from '../runContext'
import { StreamDependencies } from '../unified-handler/types'
import { enrichStreamWithPostData } from './enrichStreamWithPostData'
import { processChatSave } from './processChatSave'

/**
 * 流式对话完成处理配置
 */
export interface StreamFinalizationConfig {
  /** 问题状态 */
  questionStatus: ChatQuestionStatus
}

/**
 * 流式对话完成处理结果
 */
export interface StreamFinalizationResult {
  /** 格式化后的最终内容 */
  formattedContent: string
  /** 实体数据 */
  entities: ChatEntityRecognize[]
  /** 追踪数据 */
  traces: string
}

/**
 * 流式对话完成处理函数
 *
 * 在流式对话完成后执行的后处理流程，包括：
 * 1. 获取实体数据和追踪数据
 * 2. 格式化最终答案
 * 3. 保存对话记录
 * 4. 更新运行时状态
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param config - 流式完成配置
 * @param dependencies - 流式处理依赖（可选），用于自定义内容格式化
 */
export async function processStreamFinalization<
  TInput extends ChatSendInput = ChatSendInput,
  AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre,
>(
  context: ChatRunContext<TInput>,
  config: StreamFinalizationConfig,
  dependencies?: StreamDependencies<AgentMsg>
): Promise<StreamFinalizationResult> {
  const { runtime } = context
  const { rawSentenceID, chatId, aigcContent } = runtime
  const { questionStatus } = config

  if (!rawSentenceID) {
    throw new Error('rawSentenceID is required for stream finalization')
  }

  try {
    // 事件：流式完成开始
    context.eventBus?.emit('streamFinalization:start', {
      rawSentenceID,
      chatId,
      questionStatus,
      input: context.input,
      runtime: context.runtime,
    })

    // 使用专门的流式数据获取 process 函数，自动从 context.runtime 获取流式内容进行格式化
    const StreamPostDataFetchRes = await enrichStreamWithPostData(context, dependencies)

    const { traces, entities, formattedContent } = StreamPostDataFetchRes

    // 保存对话记录 - 使用新的 process 函数
    await processChatSave(context, {
      questionStatus,
      customRawSentence: context.input.content,
    })

    const result: StreamFinalizationResult = {
      formattedContent: formattedContent || aigcContent, // 使用格式化内容或原始内容作为后备
      entities: entities || [],
      traces: Array.isArray(traces) ? JSON.stringify(traces) : traces || '',
    }

    // 事件：流式完成成功
    context.eventBus?.emit('streamFinalization:success', {
      ...result,
      input: context.input,
      runtime: context.runtime,
    })

    return result
  } catch (error) {
    // 事件：流式完成错误
    context.eventBus?.emit('streamFinalization:error', {
      error: error as Error,
      input: context.input,
      runtime: context.runtime,
    })

    throw error
  }
}
