/**
 * ChatRunContext 类实现 - 主要实现
 *
 * 提供强封装性和内聚的状态管理，所有相关逻辑都集中在类中
 *
 * 设计原则：
 * - 强封装：关键状态通过私有字段保护
 * - 内聚性：相关逻辑集中在类方法中
 * - 事件驱动：状态变更自动触发事件
 * - 类型安全：完整的 TypeScript 类型支持
 */

import type { ChatSendInput } from '@/types/ai-chat-perf'
import { createEventBus, type ChatProcessEventBus } from './events'
import type { ChatStaticConfig, RuntimeState } from './types'

/**
 * ChatRunContext 类实现
 *
 * 核心特性：
 * - 强封装性：防止外部直接修改关键字段
 * - 状态管理：集中管理运行时状态变更
 * - 事件驱动：状态变更自动触发相应事件
 * - 生命周期管理：提供完整的上下文生命周期控制
 */
export class ChatRunContext<TInput extends ChatSendInput = ChatSendInput> {
  // 私有字段，防止外部直接访问
  private _abortController: AbortController | null = null
  private _streamAbortController: AbortController | null = null
  private _runtime: RuntimeState
  private _entitiesFetched: boolean = false
  private _timeoutRef: number | null = null
  private _isDestroyed: boolean = false

  // 只读字段，外部可以访问但不能修改
  public readonly staticCfg: ChatStaticConfig
  public readonly input: TInput
  public readonly eventBus: ChatProcessEventBus<TInput>

  constructor(input: TInput, staticCfg: ChatStaticConfig, eventBus?: ChatProcessEventBus<TInput>) {
    this.staticCfg = staticCfg
    this.input = input
    this.eventBus = eventBus || createEventBus<TInput>()

    // 初始化运行时状态
    this._runtime = {
      chatId: input.chatId || '',
      aigcContent: '',
      aigcReason: '',
    }
  }

  // ==================== Getter 方法 ====================

  /** 获取运行时状态（只读） */
  get runtime(): Readonly<RuntimeState> {
    this._checkDestroyed()
    return this._runtime
  }

  /** 获取主要中止控制器 */
  get abortController(): AbortController | null {
    return this._abortController
  }

  /** 获取流式中止控制器 */
  get streamAbortController(): AbortController | null {
    return this._streamAbortController
  }

  /** 获取实体获取状态 */
  get entitiesFetched(): boolean {
    return this._entitiesFetched
  }

  /** 获取超时计时器引用 */
  get timeoutRef(): number | null {
    return this._timeoutRef
  }

  /** 检查是否为首次问题 - 根据输入的 chatId 判断 */
  get isFirstQuestion(): boolean {
    return !Boolean(this.input.chatId)
  }

  /** 检查上下文是否已销毁 */
  get isDestroyed(): boolean {
    return this._isDestroyed
  }

  // ==================== 控制器管理 ====================

  /** 创建并设置主要中止控制器 */
  createAbortController(): AbortController {
    this._checkDestroyed()
    this._abortController = new AbortController()

    // 触发事件通知外部
    this.eventBus.emit('abortController:created', {
      controller: this._abortController,
    })

    return this._abortController
  }

  /** 创建并设置流式中止控制器 */
  createStreamAbortController(): AbortController {
    this._checkDestroyed()
    this._streamAbortController = new AbortController()

    // 触发事件通知外部
    this.eventBus.emit('streamAbortController:created', {
      controller: this._streamAbortController,
    })

    return this._streamAbortController
  }

  /** 中止主要操作 */
  abort(reason?: string): void {
    if (this._abortController && !this._abortController.signal.aborted) {
      this._abortController.abort(reason)
    }
  }

  /** 中止流式操作 */
  abortStream(reason?: string): void {
    if (this._streamAbortController && !this._streamAbortController.signal.aborted) {
      this._streamAbortController.abort(reason)
    }
  }

  /** 中止所有操作 */
  abortAll(reason?: string): void {
    this.abort(reason)
    this.abortStream(reason)
  }

  /** 清除主要中止控制器 */
  clearAbortController(): void {
    if (this._abortController) {
      this._abortController = null
      this.eventBus.emit('abortController:cleared', {})
    }
  }

  /** 清除流式中止控制器 */
  clearStreamAbortController(): void {
    if (this._streamAbortController) {
      this._streamAbortController = null
      this.eventBus.emit('streamAbortController:cleared', {})
    }
  }

  // ==================== 状态管理 ====================

  /**
   * 更新运行时状态的安全方法
   * 自动触发状态变更事件和验证
   */
  updateRuntime(updates: Partial<RuntimeState>): void {
    this._checkDestroyed()

    // 更新状态
    Object.assign(this._runtime, updates)

    // 触发事件
    this.eventBus.emit('runtime:updated', {
      runtime: this._runtime,
      input: this.input,
    })
  }

  /**
   * 设置实体获取状态
   */
  setEntitiesFetched(fetched: boolean): void {
    this._checkDestroyed()
    this._entitiesFetched = fetched
  }

  /**
   * 设置超时计时器
   */
  setTimeoutRef(ref: number | null): void {
    this._checkDestroyed()
    // 清除旧的计时器
    if (this._timeoutRef !== null) {
      clearTimeout(this._timeoutRef)
    }
    this._timeoutRef = ref
  }

  /**
   * 清除超时计时器
   */
  clearTimeout(): void {
    if (this._timeoutRef !== null) {
      clearTimeout(this._timeoutRef)
      this._timeoutRef = null
    }
  }

  // ==================== 生命周期管理 ====================

  /**
   * 销毁上下文，清理所有资源
   */
  destroy(): void {
    if (this._isDestroyed) {
      return
    }

    // 中止所有操作
    this.abortAll('Context destroyed')

    // 清理控制器并触发事件
    this.clearAbortController()
    this.clearStreamAbortController()

    // 清理计时器
    this.clearTimeout()

    // 清理事件监听器
    this.eventBus.clear()

    // 标记为已销毁
    this._isDestroyed = true
  }

  // ==================== 私有方法 ====================

  /**
   * 检查上下文是否已销毁
   */
  private _checkDestroyed(): void {
    if (this._isDestroyed) {
      throw new Error('ChatRunContext has been destroyed')
    }
  }
}

/**
 * 工厂函数：创建 ChatRunContext 实例
 *
 * @param input - 用户输入
 * @param staticCfg - 静态配置
 * @param eventBus - 可选的事件总线，如果不提供会自动创建
 * @returns ChatRunContext 实例
 */
export function createChatRunContext<TInput extends ChatSendInput = ChatSendInput>(
  input: TInput,
  staticCfg: ChatStaticConfig,
  eventBus?: ChatProcessEventBus<TInput>
): ChatRunContext<TInput> {
  return new ChatRunContext(input, staticCfg, eventBus)
}
