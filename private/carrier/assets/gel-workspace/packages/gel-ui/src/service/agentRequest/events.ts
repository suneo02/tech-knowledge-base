/**
 * 轻量事件总线（EventBus）用于替代分散的 ProcessCallbacks 使用
 * - 强类型事件键与负载
 * - on/off/emit 简单 API
 * - 仍保留对旧 callbacks 的兼容（由各流程在触发 emit 的同时调用 safeCallCallback）
 */

// ==================== 简化的事件类型定义 ====================

/**
 * 统一的事件载荷类型映射
 *
 * 优势：
 * - 减少类型定义数量：从 20+ 个类型减少到 1 个 map
 * - 更清晰的结构：所有事件类型集中在一处
 * - 更好的维护性：添加新事件只需在 map 中添加一行
 * - 更好的 TypeScript 支持：自动推导事件名称和载荷类型
 */
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { ChatEntityRecognize, ChatQuestionStatus, ChatTraceItem, RPResponseProgress } from 'gel-api'
import type { RuntimeState } from './types'

/**
 * 流程事件映射类型
 * 所有事件都包含 input 和 runtime，直接从 ChatRunContext 传递
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 */
export type ProcessEventMap<TInput extends ChatSendInput = ChatSendInput> = {
  // Analysis 流程
  'analysis:start': { message: string; chatId: string; input: TInput; runtime: RuntimeState }
  'analysis:success': { result: any; input: TInput; runtime: RuntimeState }
  'analysis:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Data Retrieval 流程
  'dataRetrieval:start': { chatId: string; rawSentenceID: string; input: TInput; runtime: RuntimeState }
  'dataRetrieval:success': { input: TInput; runtime: RuntimeState }
  'dataRetrieval:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Question Decomposition 流程
  'questionDecomposition:start': { rawSentenceID: string; input: TInput; runtime: RuntimeState }
  'questionDecomposition:success': { result: any; input: TInput; runtime: RuntimeState }
  'questionDecomposition:error': { error: Error; input: TInput; runtime: RuntimeState }
  'question:received': {
    questions: string[]
    input: TInput
    runtime: RuntimeState
  }
  'progress:received': {
    progress: RPResponseProgress
    questions?: string[]
    input: TInput
    runtime: RuntimeState
  }

  // Stream Finalization 流程
  'streamFinalization:start': {
    rawSentenceID: string
    chatId: string
    questionStatus: ChatQuestionStatus
    input: TInput
    runtime: RuntimeState
  }
  'streamFinalization:success': {
    formattedContent: string
    entities: ChatEntityRecognize[]
    traces: string
    input: TInput
    runtime: RuntimeState
  }
  'streamFinalization:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Chat Save 流程
  'chatSave:start': {
    chatId: string
    rawSentenceID?: string
    questionStatus?: any
    input: TInput
    runtime: RuntimeState
  }
  'chatSave:success': {
    success: boolean
    chatId: string
    rawSentenceID?: string
    response?: any
    input: TInput
    runtime: RuntimeState
  }
  'chatSave:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Data Fetch 流程
  'dataFetch:start': { rawSentenceID?: string; input: TInput; runtime: RuntimeState }
  'dataFetch:success': {
    success: boolean
    traces: ChatTraceItem[]
    entities: ChatEntityRecognize[]
    formattedContent?: string
    traceCount: number
    entityCount: number
    input: TInput
    runtime: RuntimeState
  }
  'dataFetch:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Trace Fetch 流程
  'traceFetch:start': { rawSentenceID: string; input: TInput; runtime: RuntimeState }
  'traceFetch:success': { traces: ChatTraceItem[]; count: number; input: TInput; runtime: RuntimeState }
  'traceFetch:error': { error: Error; input: TInput; runtime: RuntimeState }

  // Entity Fetch 流程
  'entityFetch:start': { rawSentenceID: string; input: TInput; runtime: RuntimeState }
  'entityFetch:success': { entities: ChatEntityRecognize[]; count: number; input: TInput; runtime: RuntimeState }
  'entityFetch:error': { error: Error; input: TInput; runtime: RuntimeState }

  // 消息转换
  'message:transform': {
    originalMessage: any
    transformedMessage?: any
  }

  // Runtime State 同步事件
  'runtime:updated': {
    runtime: RuntimeState
    input: TInput
  }

  // AbortController 状态变更事件
  'abortController:created': { controller: AbortController }
  'abortController:cleared': {}
  'streamAbortController:created': { controller: AbortController }
  'streamAbortController:cleared': {}

  // 通用事件
  error: { error: Error; phase: string }
  complete: any
}

export type ProcessEventKey<TInput extends ChatSendInput = ChatSendInput> = keyof ProcessEventMap<TInput>

export type ProcessEventHandler<
  TInput extends ChatSendInput = ChatSendInput,
  K extends ProcessEventKey<TInput> = ProcessEventKey<TInput>,
> = (payload: ProcessEventMap<TInput>[K]) => void | Promise<void>

export interface ChatProcessEventBus<TInput extends ChatSendInput = ChatSendInput> {
  on<K extends ProcessEventKey<TInput>>(event: K, handler: ProcessEventHandler<TInput, K>): void
  off<K extends ProcessEventKey<TInput>>(event: K, handler: ProcessEventHandler<TInput, K>): void
  emit<K extends ProcessEventKey<TInput>>(event: K, payload: ProcessEventMap<TInput>[K]): void
  clear(): void
}

/**
 * 轻量级事件总线实现
 *
 * 使用 Class 实现的优势：
 * - 更好的性能：方法共享原型，避免重复创建函数
 * - 更好的调试体验：清晰的类名和方法名在调用栈中
 * - 更强的扩展性：支持继承和功能扩展
 * - 更好的 TypeScript 支持：类型推导和智能提示更准确
 */
export class ChatProcessEventBusImpl<TInput extends ChatSendInput = ChatSendInput>
  implements ChatProcessEventBus<TInput>
{
  private readonly listeners = new Map<ProcessEventKey<TInput>, Set<Function>>()

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on<K extends ProcessEventKey<TInput>>(event: K, handler: ProcessEventHandler<TInput, K>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as unknown as Function)
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param handler 要移除的事件处理函数
   */
  off<K extends ProcessEventKey<TInput>>(event: K, handler: ProcessEventHandler<TInput, K>): void {
    this.listeners.get(event)?.delete(handler as unknown as Function)
  }

  /**
   * 发出事件
   * @param event 事件名称
   * @param payload 事件载荷
   */
  emit<K extends ProcessEventKey<TInput>>(event: K, payload: ProcessEventMap<TInput>[K]): void {
    const handlers = this.listeners.get(event)
    if (!handlers || handlers.size === 0) return

    for (const handler of handlers) {
      try {
        const result = (handler as (p: ProcessEventMap<TInput>[K]) => void | Promise<void>)(payload)
        if (result && typeof (result as Promise<void>).then === 'function') {
          ;(result as Promise<void>).catch((error) =>
            console.error(`[ChatProcessEventBus] Async event handler failed for '${event}':`, error)
          )
        }
      } catch (error) {
        console.error(`[ChatProcessEventBus] Event handler failed for '${event}':`, error)
      }
    }
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.listeners.clear()
  }

  /**
   * 获取指定事件的监听器数量（用于调试）
   * @param event 事件名称
   * @returns 监听器数量
   */
  getListenerCount<K extends ProcessEventKey<TInput>>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }

  /**
   * 获取所有已注册的事件名称（用于调试）
   * @returns 事件名称数组
   */
  getRegisteredEvents(): ProcessEventKey<TInput>[] {
    return Array.from(this.listeners.keys())
  }
}

/**
 * 创建事件总线实例
 * 保持向后兼容的工厂函数
 *
 * @template TInput - 输入类型，默认为 ChatSendInput
 */
export function createEventBus<TInput extends ChatSendInput = ChatSendInput>(): ChatProcessEventBus<TInput> {
  return new ChatProcessEventBusImpl<TInput>()
}
