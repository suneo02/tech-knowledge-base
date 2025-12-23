/**
 * 统一聊天处理器类型定义
 *
 * 重构后的简化架构：
 * - ChatRunContext 包含所有核心状态和流程字段
 * - StreamDependencies 包含外部依赖和回调
 * - 流程函数直接使用 ChatRunContext + StreamDependencies
 */

import { ChatProcessEventBus, XRequestClass } from '@/service'
import { AgentMsgAIDepre } from '@/types'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { formatAIAnswerFull } from 'gel-util/common'
import { ChatRunContext } from '../runContext'

/**
 * 流式处理依赖 - 包含外部依赖和回调函数
 */
export interface StreamDependencies<AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre> {
  // UI 状态控制
  setContent: (content: string) => void
  setIsChating: (isChating: boolean) => void

  // 注意：AbortController 管理现在通过 ChatRunContext 的事件系统处理
  // 可以监听 'abortController:created', 'abortController:cleared',
  // 'streamAbortController:created', 'streamAbortController:cleared' 等事件

  // EventBus 事件订阅 - 推荐的事件通知机制
  registerEventListeners?: <TInput extends ChatSendInput = ChatSendInput>(eventBus: ChatProcessEventBus<TInput>) => void

  // 网络请求
  create: XRequestClass['create']

  // 可选功能
  transformerOnStreamSucces?: (message: AgentMsgAIDepre) => Promise<AgentMsgAIDepre>

  /**
   * 自定义内容格式化器（可选）
   *
   * 在流式完成后格式化 AI 回答内容。
   * 如果不提供，将使用默认的 formatAnswerWithAnnotations（插入溯源标记）。
   *
   * 典型使用场景：
   * - 报告场景：不插入溯源标记，溯源标记由渲染器在文档末尾统一生成
   * - 特殊格式化需求：自定义实体链接、溯源标记的格式
   */
  customContentFormatter?: typeof formatAIAnswerFull

  // 流程回调
  onAgentSuccess: (message: AgentMsg[]) => void
  onAgentUpdate: (message: AgentMsg) => void
}

/**
 * 流程函数类型定义 - 简化为只需要 ChatRunContext 和 StreamDependencies
 */
export type ProcessFunction<AgentMsg extends AgentMsgAIDepre = AgentMsgAIDepre> = (
  context: ChatRunContext,
  dependencies: StreamDependencies<AgentMsg>
) => Promise<void>

/**
 * 超时管理器函数类型定义
 * 重构为函数式架构，不再使用闭包接口
 */
export type TimeoutResetFunction = (context: ChatRunContext, timeout?: number, onTimeout?: () => void) => void

export type StreamAbortFunction = (context: ChatRunContext, dependencies: StreamDependencies) => void

export type StreamFinishFunction = (
  context: ChatRunContext,
  dependencies: StreamDependencies,
  params: { questionStatus: any }
) => Promise<void>

export type StreamFinalizationFunction = (
  context: ChatRunContext,
  dependencies: StreamDependencies,
  questionStatus: any
) => Promise<void>

// ==================== 向后兼容的类型别名 ====================

/**
 * @deprecated 使用 StreamDependencies 替代
 */
export type UnifiedChatHandlerDependencies = StreamDependencies

/**
 * @deprecated 不再需要 ProcessContext，直接使用 ChatRunContext + StreamDependencies
 */
export interface ProcessContext {
  runContext: ChatRunContext
  dependencies: StreamDependencies
}
