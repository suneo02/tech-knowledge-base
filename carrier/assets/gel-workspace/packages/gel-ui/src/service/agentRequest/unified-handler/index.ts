/**
 * 统一聊天处理器 - 模块化导出
 */

// 导出类型定义
export type { ProcessFunction, StreamAbortFunction, StreamDependencies, TimeoutResetFunction } from './types'

// 导出流程步骤
export { processPreprocessing } from './processSteps'

// 导出超时管理函数
export { clearTimeoutTimer, handleStreamAbort, resetTimeout } from './timeout'

// 流式完成处理函数已合并到 streamProcessor 中

// 导出分析埋点函数
export { reportAnalytics } from './analytics'

// 导出流式处理
export { processStreamRequest } from './streamProcessor'

/**
 * 统一聊天处理器 - 主处理器文件
 *
 * 基于函数式流程设计，将原来的两个耦合函数合并为一个统一的处理器
 * 保持 API 兼容性，支持渐进式迁移
 */

import { AgentMsgDepre, ChatSendInput } from '@/types'
import { XAgentConfig } from '@ant-design/x/es/use-x-agent'
import { ERROR_TEXT } from 'gel-util/config'

import {
  createAgentAIMsgStream,
  createAgentMsgAIDataRetrieval,
  createAgentMsgAIInitBySendInput,
  createAgentMsgAISubQuestion,
  CreateHandleError,
} from '../helper'
import { processChatPreflight, processChatSave } from '../processes'
import { createChatRunContext } from '../runContext'
import { ChatStaticConfig } from '../types'
import { processPreprocessing } from './processSteps'
import { processStreamRequest } from './streamProcessor'
import { StreamDependencies } from './types'

/**
 * 统一的聊天处理器 - 主函数
 *
 * 基于函数式流程设计，将原来的两个耦合函数合并为一个统一的处理器
 * 保持 API 兼容性，支持渐进式迁移
 */
export const createXAgentRequest = (
  dependencies: Omit<StreamDependencies, 'onAgentSuccess' | 'onAgentUpdate'>,
  staticCfg: ChatStaticConfig
): XAgentConfig<AgentMsgDepre, ChatSendInput, AgentMsgDepre>['request'] => {
  return async (input, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!input) {
      dependencies.setIsChating(false)
      return
    }

    // 创建简化的运行上下文，包含所有流程回调
    const streamDependencies: StreamDependencies = {
      ...dependencies,
      onAgentSuccess,
      onAgentUpdate,
    }

    const context = createChatRunContext(input, staticCfg)

    // 外部如需暂停或取消，请使用 onAbortControllerChange / onStreamAbortControllerChange 提供的 controller

    // 注册内部事件监听器
    if (context.eventBus) {
      // 内部处理 question:received 事件
      context.eventBus.on('question:received', ({ questions, input }) => {
        onAgentUpdate({
          ...createAgentMsgAISubQuestion(input, questions),
          status: 'pending',
        })
      })
    }

    // 注册外部 EventBus 事件监听器
    dependencies.registerEventListeners?.(context.eventBus!)

    // 错误处理函数
    const handleError = (error: CreateHandleError) => {
      const { errorCode } = error
      dependencies.setIsChating(false)
      // AbortController 清理现在通过 context.clearAbortController() 处理

      const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT']
      const agentMsg: AgentMsgDepre = {
        ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
        status: 'finish',
        questionStatus: errorCode,
      }

      // @ts-expect-error 保持原有的类型兼容性
      onAgentSuccess(agentMsg)

      processChatSave(context, {
        questionStatus: errorCode,
      })
    }

    try {
      // 执行统一的处理流程
      await processPreprocessing(context, streamDependencies)

      // 初始化状态更新
      onAgentUpdate({
        ...createAgentMsgAIInitBySendInput(input),
        status: 'pending',
      })

      // Preflight 处理：执行会话初始化、子问题处理
      await processChatPreflight(context)
      // 清理 preflight 阶段的 AbortController（会自动触发 'abortController:cleared' 事件）
      context.clearAbortController()

      // 流式处理准备：创建流式控制器
      // 创建新的流式 AbortController（会自动触发 'streamAbortController:created' 事件）
      context.createStreamAbortController()

      // 更新为接收状态
      const aiResRef = createAgentMsgAIDataRetrieval(input, context)
      onAgentUpdate({
        ...aiResRef,
        status: 'receiving',
      })

      // 执行流式请求处理
      await processStreamRequest(context, streamDependencies)

      // Unified chat processing completed
    } catch (error) {
      handleError(error as CreateHandleError)
    }
  }
}
