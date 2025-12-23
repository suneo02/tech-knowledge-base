import { beforeEach, describe, expect, it } from 'vitest'
import { CacheManager, createCacheManager } from '../cacheManager'

describe('CacheManager', () => {
  let cacheManager: CacheManager

  beforeEach(() => {
    cacheManager = createCacheManager(100)
  })

  describe('lookup', () => {
    it('应该返回空结果当缓存为空时', () => {
      const result = cacheManager.lookup('zh-CN', 'en-US', ['测试'])
      expect(result.cached.size).toBe(0)
      expect(result.pending.size).toBe(0)
      expect(result.needsRequest).toEqual(['测试'])
    })

    it('应该从缓存中查找已存在的翻译', () => {
      // 先存储一些翻译
      const translations = new Map([['测试', 'Test']])
      cacheManager.store('zh-CN', 'en-US', translations)

      const result = cacheManager.lookup('zh-CN', 'en-US', ['测试'])
      expect(result.cached.size).toBe(1)
      expect(result.cached.get('测试')).toBe('Test')
      expect(result.needsRequest).toEqual([])
    })

    it('应该识别进行中的翻译请求', () => {
      const promise = Promise.resolve('Test')
      const promises = new Map([['测试', promise]])

      cacheManager.registerPending('zh-CN', 'en-US', promises)

      const result = cacheManager.lookup('zh-CN', 'en-US', ['测试'])
      expect(result.pending.size).toBe(1)
      expect(result.pending.get('测试')).toBe(promise)
      expect(result.needsRequest).toEqual([])
    })

    it('应该处理混合情况：部分缓存、部分进行中、部分需要请求', () => {
      // 缓存一个
      cacheManager.store('zh-CN', 'en-US', new Map([['文本1', 'Text1']]))

      // 注册一个进行中
      cacheManager.registerPending('zh-CN', 'en-US', new Map([['文本2', Promise.resolve('Text2')]]))

      const result = cacheManager.lookup('zh-CN', 'en-US', ['文本1', '文本2', '文本3'])

      expect(result.cached.size).toBe(1)
      expect(result.cached.get('文本1')).toBe('Text1')
      expect(result.pending.size).toBe(1)
      expect(result.needsRequest).toEqual(['文本3'])
    })
  })

  describe('store', () => {
    it('应该存储翻译结果', () => {
      const translations = new Map([
        ['测试1', 'Test1'],
        ['测试2', 'Test2'],
      ])

      cacheManager.store('zh-CN', 'en-US', translations)

      const result = cacheManager.lookup('zh-CN', 'en-US', ['测试1', '测试2'])
      expect(result.cached.size).toBe(2)
      expect(result.cached.get('测试1')).toBe('Test1')
      expect(result.cached.get('测试2')).toBe('Test2')
    })

    it('应该在缓存满时删除最早的条目 (FIFO)', () => {
      const smallCache = createCacheManager(2)

      smallCache.store('zh-CN', 'en-US', new Map([['文本1', 'Text1']]))
      smallCache.store('zh-CN', 'en-US', new Map([['文本2', 'Text2']]))
      smallCache.store('zh-CN', 'en-US', new Map([['文本3', 'Text3']]))

      expect(smallCache.cacheSize()).toBe(2)

      // 文本1 应该被删除
      const result = smallCache.lookup('zh-CN', 'en-US', ['文本1', '文本2', '文本3'])
      expect(result.cached.has('文本1')).toBe(false)
      expect(result.cached.has('文本2')).toBe(true)
      expect(result.cached.has('文本3')).toBe(true)
    })
  })

  describe('registerPending', () => {
    it('应该注册进行中的请求', () => {
      const promise = Promise.resolve('Test')
      const promises = new Map([['测试', promise]])

      cacheManager.registerPending('zh-CN', 'en-US', promises)

      expect(cacheManager.pendingSize()).toBe(1)
    })

    it('应该在 Promise 完成后自动清理', async () => {
      const promise = Promise.resolve('Test')
      const promises = new Map([['测试', promise]])

      cacheManager.registerPending('zh-CN', 'en-US', promises)
      expect(cacheManager.pendingSize()).toBe(1)

      await promise
      // 等待清理
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(cacheManager.pendingSize()).toBe(0)
    })

    it('应该在 Promise 失败后也清理', async () => {
      const promise = Promise.reject(new Error('Failed'))
      const promises = new Map([['测试', promise]])

      cacheManager.registerPending('zh-CN', 'en-US', promises)
      expect(cacheManager.pendingSize()).toBe(1)

      await promise.catch(() => {})
      // 等待清理
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(cacheManager.pendingSize()).toBe(0)
    })
  })

  describe('clear', () => {
    it('应该清空所有缓存和进行中的请求', () => {
      cacheManager.store('zh-CN', 'en-US', new Map([['测试', 'Test']]))
      cacheManager.registerPending('zh-CN', 'en-US', new Map([['文本', Promise.resolve('Text')]]))

      expect(cacheManager.cacheSize()).toBeGreaterThan(0)
      expect(cacheManager.pendingSize()).toBeGreaterThan(0)

      cacheManager.clear()

      expect(cacheManager.cacheSize()).toBe(0)
      expect(cacheManager.pendingSize()).toBe(0)
    })
  })

  describe('cacheSize', () => {
    it('应该返回正确的缓存大小', () => {
      expect(cacheManager.cacheSize()).toBe(0)

      cacheManager.store('zh-CN', 'en-US', new Map([['测试1', 'Test1']]))
      expect(cacheManager.cacheSize()).toBe(1)

      cacheManager.store('zh-CN', 'en-US', new Map([['测试2', 'Test2']]))
      expect(cacheManager.cacheSize()).toBe(2)
    })
  })

  describe('pendingSize', () => {
    it('应该返回正确的进行中请求数量', () => {
      expect(cacheManager.pendingSize()).toBe(0)

      cacheManager.registerPending('zh-CN', 'en-US', new Map([['测试', Promise.resolve('Test')]]))
      expect(cacheManager.pendingSize()).toBe(1)
    })
  })

  describe('getStats', () => {
    it('应该返回缓存统计信息', () => {
      const smallCache = createCacheManager(10)
      smallCache.store('zh-CN', 'en-US', new Map([['测试', 'Test']]))

      const stats = smallCache.getStats()

      expect(stats.size).toBe(1)
      expect(stats.maxSize).toBe(10)
      expect(stats.utilization).toBe('10.00%')
      expect(stats.pending).toBe(0)
    })

    it('应该正确计算使用率', () => {
      const smallCache = createCacheManager(4)
      smallCache.store('zh-CN', 'en-US', new Map([['测试1', 'Test1']]))
      smallCache.store('zh-CN', 'en-US', new Map([['测试2', 'Test2']]))

      const stats = smallCache.getStats()

      expect(stats.utilization).toBe('50.00%')
    })

    it('应该包含进行中请求数量', () => {
      cacheManager.registerPending('zh-CN', 'en-US', new Map([['测试', Promise.resolve('Test')]]))

      const stats = cacheManager.getStats()

      expect(stats.pending).toBe(1)
    })
  })

  describe('createCacheManager', () => {
    it('应该创建指定大小的缓存管理器', () => {
      const cache = createCacheManager(50)
      expect(cache.getStats().maxSize).toBe(50)
    })

    it('应该使用默认大小 10000', () => {
      const cache = createCacheManager()
      expect(cache.getStats().maxSize).toBe(10000)
    })
  })
})
