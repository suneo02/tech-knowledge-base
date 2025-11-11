/**
 * 流式请求处理模块
 *
 * 参考 handleStreamRequest.ts 的简洁设计，但保持合理的函数拆分：
 * - 主流程函数：processStreamRequest
 * - 完成处理函数：handleStreamFinish
 * - 埋点上报函数：reportStreamAnalytics
 * - 消息创建函数：createFinalMessage, createFallbackMessage
 */

import { isAbortError } from '@/constants/error'
import { AgentMsgAIDepre } from '@/types'
import {
  BuryAction,
  ChatEntityRecognize,
  ChatQuestionStatus,
  GetResultRequest,
  postPointBuriedWithAxios,
  StreamChunk,
} from 'gel-api'
import { eaglesError } from 'gel-util/errorLogger'
import { createAgentAIMsgStream, createHandleError, parseStreamThunk } from '../helper'
import { processStreamFinalization } from '../processes'
import { ChatRunContext } from '../runContext'
import { RuntimeState } from '../types'
import { clearTimeoutTimer, resetTimeout } from './timeout'
import { StreamDependencies } from './types'

/**
 * 上报流式请求相关的埋点数据
 */
function reportStreamAnalytics(context: ChatRunContext): void {
  const { staticCfg, input } = context
  const { axiosEntWeb } = staticCfg

  // 上报埋点 - 参考旧版逻辑
  postPointBuriedWithAxios(axiosEntWeb, BuryAction.NORMAL_ANSWER, {
    isDeepThinking: input.think ? true : false,
  })

  if (input.think) {
    postPointBuriedWithAxios(axiosEntWeb, '922610370003')
  }

  if (input.deepSearch) {
    postPointBuriedWithAxios(axiosEntWeb, '922604570280', { question: input.content })
  }
}

/**
 * 创建最终的消息对象
 */
function createFinalMessage(
  context: ChatRunContext,
  formattedContent: string,
  entities: ChatEntityRecognize[],
  questionStatus: ChatQuestionStatus
) {
  const { input, runtime } = context

  return {
    ...createAgentAIMsgStream(input, context, formattedContent, runtime.aigcReason),
    entity: entities,
    gelData: runtime.gelData,
    splTable: runtime.splTable,
    reportData: runtime.reportData,
    status: 'finish' as const,
    questionStatus,
  }
}

/**
 * 创建失败时的回退消息
 */
function createFallbackMessage(context: ChatRunContext, questionStatus: ChatQuestionStatus) {
  const { input, runtime } = context

  return {
    ...createAgentAIMsgStream(input, context, runtime.aigcContent, runtime.aigcReason),
    status: 'finish' as const,
    questionStatus,
  }
}

/**
 * 处理流式完成逻辑
 * 参考 handleStreamRequest.ts 的 handleFinish 函数
 */
async function handleStreamFinish<AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre>(
  context: ChatRunContext,
  dependencies: StreamDependencies<AgentMsg>,
  questionStatus: ChatQuestionStatus
): Promise<void> {
  const { input, runtime } = context
  const { setIsChating, onAgentSuccess, onAgentUpdate } = dependencies

  // 清理超时计时器
  clearTimeoutTimer(context)

  // 重置状态
  setIsChating(false)
  // StreamAbortController 清理现在通过 context.clearStreamAbortController() 处理

  // 更新为 stream_finish 状态
  const agentMsg: AgentMsgAIDepre = {
    ...createAgentAIMsgStream(input, context, runtime.aigcContent, runtime.aigcReason),
    gelData: runtime.gelData,
    splTable: runtime.splTable,
    reportData: runtime.reportData,
    status: 'stream_finish',
  }
  onAgentUpdate(agentMsg as AgentMsg)

  // 获取实体数据和最终化处理（防重复）- 使用 ChatRunContext 的统一状态管理
  if (!context.entitiesFetched) {
    context.setEntitiesFetched(true)

    try {
      // 使用新的 process 函数处理流式完成逻辑，传递 dependencies 以支持自定义格式化
      const finalizationResult = await processStreamFinalization(context, { questionStatus }, dependencies)

      // 创建最终消息
      const finalMessage = createFinalMessage(
        context,
        finalizationResult.formattedContent,
        finalizationResult.entities,
        questionStatus
      )

      // 应用自定义转换器（如果存在）
      if (dependencies.transformerOnStreamSucces) {
        const transformedMessage = await dependencies.transformerOnStreamSucces(finalMessage)

        // onAgentUpdate 似乎是必要的，否则无法成功更新
        onAgentUpdate(transformedMessage as AgentMsg)
        // @ts-expect-error 保持与旧版 handleStreamRequest 的兼容性
        onAgentSuccess(transformedMessage)
      } else {
        onAgentUpdate(finalMessage as AgentMsg)
        // @ts-expect-error 保持与旧版 handleStreamRequest 的兼容性
        onAgentSuccess(finalMessage)
      }

      // 上报埋点
      reportStreamAnalytics(context)
    } catch (error) {
      // 即使最终处理失败，也要调用 onSuccess 以避免界面卡住
      const fallbackMessage = createFallbackMessage(context, questionStatus)
      // @ts-expect-error 保持与旧版 handleStreamRequest 的兼容性
      onAgentSuccess(fallbackMessage)
    } finally {
      // 发出完成事件，外部可以通过 EventBus 监听来执行刷新等操作
      context.eventBus?.emit('complete', { success: true })
    }
  }
}

/**
 * 流程5: 流式请求处理
 *
 * 参考旧版 handleStreamRequest 的简洁设计，但保持合理的函数拆分
 *
 * 重要：参考旧版逻辑，onUpdate 的 DONE 和 onSuccess 都可能被调用
 * 使用 ChatRunContext.entitiesFetched 标志防止重复处理实体获取和最终化逻辑
 */
export async function processStreamRequest<AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre>(
  context: ChatRunContext,
  dependencies: StreamDependencies<AgentMsg>
): Promise<void> {
  const { input, staticCfg, runtime } = context
  const { axiosEntWeb } = staticCfg
  const { chatId, rawSentenceID } = runtime
  const { create, onAgentUpdate } = dependencies

  // 重置 entitiesFetched 状态，确保每次流式请求都能正常处理
  context.setEntitiesFetched(false)

  // 创建超时处理回调
  const onTimeout = () => {
    handleStreamFinish(context, dependencies, ChatQuestionStatus.FAILED)
  }

  // 启动初始超时计时器 20s
  resetTimeout(context, 20000, onTimeout)

  return create<GetResultRequest, StreamChunk>(
    {
      rawSentence: input.content || '',
      rawSentenceID: rawSentenceID || '',
      agentId: input.agentId,
      version: 1,
      think: input.think || input.deepSearch,
      clientType: input.clientType,
      agentParam: input.agentParam,
      chatId: chatId,
      // @ts-expect-error 临时方案 2025-07-30 兼容后端问题，预计一周后去除
      deepSearch: input.deepSearch, // 目前这个字段坤元没有用到，用的是 think 字段，后续他修改
    },
    {
      onSuccess: async () => {
        await handleStreamFinish(context, dependencies, ChatQuestionStatus.SUCCESS)
      },
      onUpdate: (chunk: StreamChunk) => {
        try {
          resetTimeout(context, undefined, onTimeout)
          const parsedChunk = parseStreamThunk(chunk, context.streamAbortController)

          if (parsedChunk?.type === 'DONE') {
            // 流式输出完成，参考旧版逻辑：
            // onUpdate 的 DONE 只处理实体获取，onSuccess 处理完整的完成逻辑
            // 使用 ChatRunContext.entitiesFetched 标志防止重复处理
            handleStreamFinish(context, dependencies, ChatQuestionStatus.SUCCESS)
          } else if (parsedChunk?.type === 'UPDATE') {
            const { content, reasonContent } = parsedChunk.payload
            const updates: Partial<RuntimeState> = {}

            if (content) {
              updates.aigcContent = runtime.aigcContent + content
            }
            if (reasonContent) {
              updates.aigcReason = runtime.aigcReason + reasonContent
            }

            // 使用类方法更新运行时状态，确保外部监听器能收到状态变更
            if (Object.keys(updates).length > 0) {
              context.updateRuntime(updates)
            }

            const agentMsg: AgentMsgAIDepre = {
              ...createAgentAIMsgStream(input, context, runtime.aigcContent, runtime.aigcReason),
              status: 'receiving',
            }
            // 更新流式内容
            onAgentUpdate(agentMsg as AgentMsg)
          }
        } catch (error) {
          throw Error(JSON.stringify({ error, chunk }))
        }
      },
      onError: (error) => {
        clearTimeoutTimer(context)

        eaglesError(axiosEntWeb, error)
        const isCancel = isAbortError(error)
        const questionStatus = isCancel ? ChatQuestionStatus.CANCELLED : ChatQuestionStatus.FAILED
        throw createHandleError({
          chatId: chatId,
          rawSentenceID: rawSentenceID || '',
          rawSentence: input.content || '',
          errorCode: questionStatus,
        })
      },
    }
  )
}
