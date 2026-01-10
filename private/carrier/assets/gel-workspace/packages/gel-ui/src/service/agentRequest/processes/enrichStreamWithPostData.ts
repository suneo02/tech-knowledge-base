/**
 * 数据获取处理函数
 *
 * 基于 ChatRunContext 的数据获取逻辑，替代原有的 fetchTrace 和 fetchEntities 函数
 * 主要功能：
 * 1. 从 ChatRunContext 中获取必要的参数
 * 2. 并行或顺序获取追踪数据和实体数据
 * 3. 处理获取结果和错误
 * 4. 通过回调通知获取状态
 * 5. 更新 ChatRunContext 中的运行时状态
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 */

import { AgentMsgAIOverall } from '@/types'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { ChatEntityRecognize, ChatTraceItem, requestToChatWithAxios } from 'gel-api'
import { formatAIAnswerFull } from 'gel-util/common'
import { ChatRunContext } from '../runContext'
import { StreamDependencies } from '../unified-handler/types'
/**
 * 数据获取结果
 */
export interface StreamPostDataFetchRes {
  /** 获取是否成功 */
  success: boolean
  /** 追踪数据 */
  traces: ChatTraceItem[]
  /** 实体数据 */
  entities: ChatEntityRecognize[]
  /** 格式化后的内容 */
  formattedContent?: string
  /** 错误信息（如果获取失败） */
  errors: {
    traceError?: Error
    entityError?: Error
  }
}

/**
 * 追踪数据获取处理函数
 *
 * 从 ChatRunContext 中提取参数并获取追踪数据
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param config - 数据获取配置
 * @param callbacks - 回调函数，用于处理各个阶段的事件
 */
export async function processTraceFetch<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<ChatTraceItem[]> {
  const { staticCfg, runtime } = context
  const { axiosInstance } = staticCfg
  const { rawSentenceID } = runtime

  if (!rawSentenceID) {
    const error = new Error('rawSentenceID is required for trace fetch')

    // 事件：trace 获取错误
    context.eventBus?.emit('traceFetch:error', {
      error,
      input: context.input,
      runtime: context.runtime,
    })

    return []
  }

  try {
    // 事件：trace 获取开始
    context.eventBus?.emit('traceFetch:start', {
      rawSentenceID,
      input: context.input,
      runtime: context.runtime,
    })

    // 调用后端 API 获取追踪数据
    const { Data } = await requestToChatWithAxios(axiosInstance, 'chat/trace', {
      rawSentenceID,
    })

    const traces: ChatTraceItem[] = Array.isArray(Data) ? Data : []

    // 事件：trace 获取成功
    context.eventBus?.emit('traceFetch:success', {
      traces,
      count: traces.length,
      input: context.input,
      runtime: context.runtime,
    })

    return traces
  } catch (error) {
    const fetchError = error as Error

    // 事件：trace 获取错误
    context.eventBus?.emit('traceFetch:error', {
      error: fetchError,
      input: context.input,
      runtime: context.runtime,
    })

    // 追踪获取失败通常不应该阻断主流程，返回空数组
    return []
  }
}

/**
 * 实体数据获取处理函数
 *
 * 从 ChatRunContext 中提取参数并获取实体数据
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @template TChunk - 模型分片类型，默认为 ModelChunk
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param config - 数据获取配置
 * @param callbacks - 回调函数，用于处理各个阶段的事件
 */
export async function processEntityFetch<TInput extends ChatSendInput = ChatSendInput>(
  context: ChatRunContext<TInput>
): Promise<ChatEntityRecognize[]> {
  const { staticCfg, runtime } = context
  const { axiosInstance } = staticCfg
  const { rawSentenceID } = runtime

  if (!rawSentenceID) {
    const error = new Error('rawSentenceID is required for entity fetch')
    // Missing rawSentenceID

    // 事件：entity 获取错误
    context.eventBus?.emit('entityFetch:error', {
      error,
      input: context.input,
      runtime: context.runtime,
    })

    return []
  }

  try {
    // 事件：entity 获取开始
    context.eventBus?.emit('entityFetch:start', {
      rawSentenceID,
      input: context.input,
      runtime: context.runtime,
    })

    // Fetching entity data

    // 调用后端 API 获取实体数据
    const { result } = await requestToChatWithAxios(axiosInstance, 'chat/sessionComplete', {
      rawSentenceID,
    })

    const entities: ChatEntityRecognize[] = Array.isArray(result) ? result : []

    // 事件：entity 获取成功
    context.eventBus?.emit('entityFetch:success', {
      entities,
      count: entities.length,
      input: context.input,
      runtime: context.runtime,
    })

    return entities
  } catch (error) {
    const fetchError = error as Error

    // 事件：entity 获取错误
    context.eventBus?.emit('entityFetch:error', {
      error: fetchError,
      input: context.input,
      runtime: context.runtime,
    })

    // 实体获取失败通常不应该阻断主流程，返回空数组
    return []
  }
}

/**
 * 流式输出后增强数据获取处理函数
 *
 * 专门用于流式对话完成后获取额外数据（实体和追踪）来增强流式结果
 * 这是一个语义明确的函数，主要在 processStreamFinalization 中使用
 *
 * 完整功能包括：
 * 1. 并行获取 traces 和 entities 数据
 * 2. 使用 formatAIAnswerFull 格式化内容（基于 context.runtime 中的流式内容）
 *    - 如果提供了 dependencies.customContentFormatter，则使用自定义格式化器
 *    - 否则使用默认的 formatAIAnswerFull
 * 3. 更新 context.runtime 状态
 * 4. 发出相应的事件通知
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 * @param context - 运行上下文，包含所有必要的配置和状态
 * @param dependencies - 流式处理依赖（可选），用于自定义内容格式化
 */
export async function enrichStreamWithPostData<
  TInput extends ChatSendInput = ChatSendInput,
  AgentMsg extends AgentMsgAIOverall = AgentMsgAIOverall,
>(context: ChatRunContext<TInput>, dependencies?: StreamDependencies<AgentMsg>): Promise<StreamPostDataFetchRes> {
  try {
    // 事件：数据获取开始
    context.eventBus?.emit('dataFetch:start', {
      rawSentenceID: context.runtime.rawSentenceID,
      input: context.input,
      runtime: context.runtime,
    })

    // 使用 Promise.all 并行获取，这样更高效且代码更简洁
    const [traces, entities] = await Promise.all([processTraceFetch(context), processEntityFetch(context)])

    // 从 context.runtime 中获取流式内容并格式化
    const { aigcContent } = context.runtime
    let formattedContent: string | undefined

    if (aigcContent) {
      // 使用自定义格式化器（如果提供）或默认格式化器
      const formatParams = {
        answers: aigcContent,
        traceContent: traces,
        entity: entities,
        dpuList: context.runtime.dpuResponse?.data,
        ragList: context.runtime.ragResponse?.items,
        modelType: context.runtime.modelType,
      }
      if (dependencies?.customContentFormatter) {
        formattedContent = dependencies.customContentFormatter(formatParams)
      } else {
        // 默认使用 formatAIAnswerFull（插入溯源标记）
        formattedContent = formatAIAnswerFull(formatParams)
      }
    }

    // 更新运行时状态 - 包含所有必要的字段
    context.updateRuntime({
      entity: entities.length > 0 ? entities : context.runtime.entity,
      traces: traces.length > 0 ? traces : context.runtime.traces,
      // 如果有格式化内容，更新 accumulatedContent
      ...(formattedContent && { accumulatedContent: formattedContent }),
    })

    const result: StreamPostDataFetchRes = {
      success: true,
      traces,
      entities,
      formattedContent,
      errors: {},
    }

    // 事件：数据获取成功
    context.eventBus?.emit('dataFetch:success', {
      success: true,
      traces,
      entities,
      formattedContent,
      traceCount: traces.length,
      entityCount: entities.length,
      input: context.input,
      runtime: context.runtime,
    })

    return result
  } catch (error) {
    const fetchError = error as Error
    const result: StreamPostDataFetchRes = {
      success: false,
      traces: [],
      entities: [],
      formattedContent: undefined,
      errors: { traceError: fetchError, entityError: fetchError },
    }

    // 事件：数据获取错误
    context.eventBus?.emit('dataFetch:error', {
      error: fetchError,
      input: context.input,
      runtime: context.runtime,
    })

    return result
  }
}
