import { SupportedLocale } from '@/intl'
import type { CacheLookupResult, TranslateCacheKey } from './types'

/**
 * 生成缓存键字符串
 */
function generateCacheKey(key: TranslateCacheKey): string {
  return `${key.sourceLocale}:${key.targetLocale}:${key.originalText}`
}

/**
 * 统一的翻译缓存管理器
 *
 * 整合翻译缓存和进行中请求管理，提供简洁的接口。主要特性：
 * - LRU 缓存策略：缓存满时删除最早的条目
 * - 并发去重：自动管理进行中的请求，避免重复翻译
 * - 自动清理：请求完成后自动从 pending 列表移除
 *
 * @example
 * ```typescript
 * const cache = new CacheManager(10000)
 *
 * // 查询缓存
 * const result = cache.lookup('zh-CN', 'en-US', ['文本1', '文本2'])
 *
 * // 存储翻译
 * cache.store('zh-CN', 'en-US', new Map([['文本1', 'Text1']]))
 *
 * // 注册进行中的请求
 * cache.registerPending('zh-CN', 'en-US', new Map([
 *   ['文本2', translatePromise]
 * ]))
 * ```
 */
export class CacheManager {
  private cache: Map<string, string>
  private pendingRequests: Map<string, Promise<string>>
  private maxSize: number

  constructor(maxSize: number = 10000) {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.maxSize = maxSize
  }

  /**
   * 统一查询缓存和进行中的请求
   *
   * 将输入的文本列表分为三类：
   * 1. 已缓存：直接返回缓存的翻译
   * 2. 进行中：返回进行中的 Promise，等待其他请求完成
   * 3. 需要新请求：返回需要发起新翻译请求的文本
   *
   * @param sourceLocale - 源语言
   * @param targetLocale - 目标语言
   * @param originalTexts - 需要查询的原文列表
   * @returns 查询结果，包含缓存命中、进行中请求和需要新请求的文本
   *
   * @example
   * ```typescript
   * const result = cache.lookup('zh-CN', 'en-US', ['文本1', '文本2', '文本3'])
   * // result: {
   * //   cached: Map(1) { '文本1' => 'Text1' },
   * //   pending: Map(1) { '文本2' => Promise<string> },
   * //   needsRequest: ['文本3']
   * // }
   * ```
   */
  lookup(sourceLocale: SupportedLocale, targetLocale: SupportedLocale, originalTexts: string[]): CacheLookupResult {
    const cached = new Map<string, string>()
    const pending = new Map<string, Promise<string>>()
    const needsRequest: string[] = []

    originalTexts.forEach((text) => {
      // 先查缓存
      const key = generateCacheKey({ sourceLocale, targetLocale, originalText: text })
      const cachedResult = this.cache.get(key)

      if (cachedResult !== undefined) {
        cached.set(text, cachedResult)
        return
      }

      // 再查进行中的请求
      const pendingPromise = this.pendingRequests.get(key)
      if (pendingPromise) {
        pending.set(text, pendingPromise)
        return
      }

      // 都没有，需要新请求
      needsRequest.push(text)
    })

    return { cached, pending, needsRequest }
  }

  /**
   * 存储翻译结果到缓存
   *
   * 将翻译结果批量存入缓存。如果缓存已满，会按 FIFO 策略删除最早的条目。
   *
   * @param sourceLocale - 源语言
   * @param targetLocale - 目标语言
   * @param translations - 原文到译文的映射
   *
   * @example
   * ```typescript
   * cache.store('zh-CN', 'en-US', new Map([
   *   ['你好', 'Hello'],
   *   ['世界', 'World']
   * ]))
   * ```
   */
  store(sourceLocale: SupportedLocale, targetLocale: SupportedLocale, translations: Map<string, string>): void {
    translations.forEach((translatedText, originalText) => {
      // 如果缓存已满，删除最早的条目（FIFO策略）
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value
        if (firstKey) {
          this.cache.delete(firstKey)
        }
      }

      const key = generateCacheKey({ sourceLocale, targetLocale, originalText })
      this.cache.set(key, translatedText)
    })
  }

  /**
   * 注册进行中的翻译请求
   *
   * 将翻译请求注册到 pending 管理器，支持并发请求去重。
   * Promise 完成（无论成功或失败）后会自动从 pending 列表移除。
   *
   * @param sourceLocale - 源语言
   * @param targetLocale - 目标语言
   * @param promises - 原文到翻译 Promise 的映射
   *
   * @example
   * ```typescript
   * const promise1 = apiTranslate({ text: '你好' })
   * const promise2 = apiTranslate({ text: '世界' })
   *
   * cache.registerPending('zh-CN', 'en-US', new Map([
   *   ['你好', promise1],
   *   ['世界', promise2]
   * ]))
   *
   * // Promise 完成后会自动清理
   * await Promise.all([promise1, promise2])
   * // pendingSize() 会变为 0
   * ```
   */
  registerPending(
    sourceLocale: SupportedLocale,
    targetLocale: SupportedLocale,
    promises: Map<string, Promise<string>>
  ): void {
    promises.forEach((promise, originalText) => {
      const key = generateCacheKey({ sourceLocale, targetLocale, originalText })
      this.pendingRequests.set(key, promise)

      // 请求完成后自动清理
      promise.finally(() => {
        this.pendingRequests.delete(key)
      })
    })
  }

  /**
   * 清空所有缓存和进行中的请求
   */
  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  /**
   * 获取缓存大小
   */
  cacheSize(): number {
    return this.cache.size
  }

  /**
   * 获取进行中的请求数量
   */
  pendingSize(): number {
    return this.pendingRequests.size
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { size: number; maxSize: number; utilization: string; pending: number } {
    const size = this.cache.size
    const utilization = ((size / this.maxSize) * 100).toFixed(2) + '%'
    return {
      size,
      maxSize: this.maxSize,
      utilization,
      pending: this.pendingRequests.size,
    }
  }
}

/**
 * 全局缓存管理器实例
 *
 * 默认的缓存管理器实例，最大缓存容量为 10000 条。
 * 大多数情况下使用此实例即可。如需独立缓存（如测试隔离、多租户场景），
 * 请使用 createCacheManager 创建新实例。
 */
export const globalCacheManager = new CacheManager()

/**
 * 创建新的缓存管理器实例
 *
 * 用于需要独立缓存空间的场景，如：
 * - 测试隔离：每个测试使用独立缓存，避免相互影响
 * - 多租户：不同租户使用独立缓存
 * - 性能调优：针对特定场景调整缓存大小
 *
 * @param maxSize - 缓存最大条目数，默认 10000
 * @returns 新的缓存管理器实例
 *
 * @example
 * ```typescript
 * // 创建小容量缓存用于测试
 * const testCache = createCacheManager(100)
 *
 * // 创建大容量缓存用于生产环境
 * const prodCache = createCacheManager(50000)
 *
 * // 使用默认容量
 * const defaultCache = createCacheManager()
 * ```
 */
export function createCacheManager(maxSize?: number): CacheManager {
  return new CacheManager(maxSize)
}
