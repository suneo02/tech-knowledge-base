import { beforeEach, describe, expect, it, vi } from 'vitest'
import { globalCacheManager } from '../cacheManager'
import { translateDataRecursively } from '../core'

describe('并发请求去重', () => {
  beforeEach(() => {
    // 每个测试前清空缓存和进行中的请求
    globalCacheManager.clear()
  })

  it('应该避免并发重复请求', async () => {
    let apiCallCount = 0

    // 模拟翻译 API，延迟 100ms 返回
    const mockApiTranslate = vi.fn(async (params: Record<string, string>) => {
      apiCallCount++
      await new Promise((resolve) => setTimeout(resolve, 100))

      const result: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        result[key] = `translated_${value}`
      })
      return result
    })

    const data1 = { name: '测试公司', description: '这是一个测试' }
    const data2 = { name: '测试公司', description: '这是一个测试' }

    // 同时发起两个相同的翻译请求
    const [result1, result2] = await Promise.all([
      translateDataRecursively(data1, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      }),
      translateDataRecursively(data2, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      }),
    ])

    // 验证：API 应该只被调用一次（请求去重生效）
    expect(apiCallCount).toBe(1)

    // 验证：两个请求都返回了正确的翻译结果
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    expect(result1.data).toEqual(result2.data)
  })

  it('应该在请求完成后自动清理进行中的记录', async () => {
    const mockApiTranslate = vi.fn(async (params: Record<string, string>) => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      const result: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        result[key] = `translated_${value}`
      })
      return result
    })

    const data = { name: '测试' }

    // 发起翻译请求
    await translateDataRecursively(data, mockApiTranslate, {
      sourceLocale: 'zh-CN',
      targetLocale: 'en-US',
    })

    // 验证：请求完成后，进行中的记录应该被清理
    expect(globalCacheManager.pendingSize()).toBe(0)
  })

  it('应该正确处理部分缓存命中的情况', async () => {
    let apiCallCount = 0

    const mockApiTranslate = vi.fn(async (params: Record<string, string>) => {
      apiCallCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      const result: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        result[key] = `translated_${value}`
      })
      return result
    })

    // 第一次请求：翻译 A 和 B
    const data1 = { field1: '文本A', field2: '文本B' }
    await translateDataRecursively(data1, mockApiTranslate, {
      sourceLocale: 'zh-CN',
      targetLocale: 'en-US',
      enableCache: true,
    })

    // 第二次请求：同时翻译 B（已缓存）和 C（未缓存）
    apiCallCount = 0 // 重置计数
    const data2 = { field1: '文本B', field2: '文本C' }
    const result = await translateDataRecursively(data2, mockApiTranslate, {
      sourceLocale: 'zh-CN',
      targetLocale: 'en-US',
      enableCache: true,
    })

    // 验证：应该只调用一次 API（翻译新的文本C，B从缓存获取）
    expect(apiCallCount).toBe(1)
    expect(result.success).toBe(true)
    expect(result.cacheStats?.hits).toBe(1) // B 从缓存命中
  })

  it('应该处理多个并发请求的混合场景', async () => {
    let apiCallCount = 0

    const mockApiTranslate = vi.fn(async (params: Record<string, string>) => {
      apiCallCount++
      await new Promise((resolve) => setTimeout(resolve, 100))
      const result: Record<string, string> = {}
      Object.entries(params).forEach(([key, value]) => {
        result[key] = `translated_${value}`
      })
      return result
    })

    // 同时发起 5 个翻译相同文本的请求
    const promises = Array.from({ length: 5 }, () =>
      translateDataRecursively({ text: '相同的文本' }, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      })
    )

    const results = await Promise.all(promises)

    // 验证：API 应该只被调用一次
    expect(apiCallCount).toBe(1)

    // 验证：所有请求都成功且结果一致
    results.forEach((result) => {
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ text: 'translated_相同的文本' })
    })
  })

  it('应该正确处理 API 失败的情况', async () => {
    const mockApiTranslate = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      throw new Error('API 调用失败')
    })

    const data = { text: '测试文本' }

    // 同时发起两个请求
    const [result1, result2] = await Promise.all([
      translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      }),
      translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      }),
    ])

    // 验证：两个请求都标记为失败，但返回原始数据
    expect(result1.success).toBe(false)
    expect(result2.success).toBe(false)
    expect(result1.data).toEqual(data)
    expect(result2.data).toEqual(data)

    // 验证：失败后进行中的记录被清理
    expect(globalCacheManager.pendingSize()).toBe(0)
  })
})
