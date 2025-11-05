/**
 * eventBus.ts
 * 事件总线模块，实现基于发布/订阅模式的组件间通信
 * 通过单例模式确保应用中只有一个事件总线实例
 */

// 事件回调函数类型
export type EventCallback = (data?: any) => void

// 事件总线类
class EventBus {
  private handlers: Record<string, EventCallback[]> = {}
  private static instance: EventBus

  /**
   * 私有构造函数，确保只能通过 getInstance 方法获取实例
   */
  private constructor() {
    this.handlers = {}
  }

  /**
   * 获取事件总线单例实例
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  /**
   * 订阅事件
   * @param eventName - 事件名称
   * @param callback - 回调函数
   */
  public on(eventName: string, callback: EventCallback): void {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = []
    }
    this.handlers[eventName].push(callback)
  }

  /**
   * 取消订阅事件
   * @param eventName - 事件名称
   * @param callback - 要取消的回调函数（如果不提供，则取消该事件的所有订阅）
   */
  public off(eventName: string, callback?: EventCallback): void {
    if (!this.handlers[eventName]) return

    if (!callback) {
      // 如果未提供回调函数，则移除该事件的所有监听器
      delete this.handlers[eventName]
    } else {
      // 否则只移除特定的回调函数
      this.handlers[eventName] = this.handlers[eventName].filter((item) => item !== callback)
    }
  }

  /**
   * 触发事件
   * @param eventName - 事件名称
   * @param data - 事件数据
   */
  public trigger(eventName: string, data?: any): void {
    if (!this.handlers[eventName]) return

    // 创建回调函数数组的副本，避免在回调执行过程中对原数组的修改造成影响
    const handlers = [...this.handlers[eventName]]

    handlers.forEach((callback) => {
      try {
        callback(data)
      } catch (e) {
        console.error(`事件处理器出错 (${eventName}):`, e)
      }
    })
  }

  /**
   * 只订阅一次事件，触发后自动取消订阅
   * @param eventName - 事件名称
   * @param callback - 回调函数
   */
  public once(eventName: string, callback: EventCallback): void {
    const onceWrapper = (data?: any) => {
      callback(data)
      this.off(eventName, onceWrapper)
    }

    this.on(eventName, onceWrapper)
  }

  /**
   * 获取特定事件的所有监听器数量
   * @param eventName - 事件名称
   * @returns 监听器数量
   */
  public listenerCount(eventName: string): number {
    return this.handlers[eventName]?.length || 0
  }

  /**
   * 获取所有已注册的事件名称
   * @returns 事件名称数组
   */
  public eventNames(): string[] {
    return Object.keys(this.handlers)
  }

  /**
   * 清空所有事件监听器
   */
  public clear(): void {
    this.handlers = {}
  }
}

// 导出事件总线单例
export const eventBus = EventBus.getInstance()
