import { beforeEach, describe, expect, it, vi } from 'vitest'
import { globalCacheManager } from '../cacheManager'
import { translateDataRecursively } from '../core'

describe('core - translateDataRecursively', () => {
  beforeEach(() => {
    globalCacheManager.clear()
  })

  const mockApiTranslate = vi.fn(async (params: Record<string, string>) => {
    const result: Record<string, string> = {}
    Object.entries(params).forEach(([key, value]) => {
      result[key] = `translated_${value}`
    })
    return result
  })

  beforeEach(() => {
    mockApiTranslate.mockClear()
  })

  describe('基本翻译功能', () => {
    it('应该成功翻译简单对象', async () => {
      const data = {
        name: '测试公司',
        description: '这是描述',
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.name).toContain('translated_')
      expect(result.data.description).toContain('translated_')
    })

    it('应该成功翻译数组', async () => {
      const data = ['测试1', '测试2', '测试3']

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data[0]).toContain('translated_')
      expect(result.data[1]).toContain('translated_')
      expect(result.data[2]).toContain('translated_')
    })

    it('应该成功翻译嵌套结构', async () => {
      const data = {
        user: {
          name: '张三',
          profile: {
            bio: '个人简介',
          },
        },
        tags: ['标签1', '标签2'],
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.user.name).toContain('translated_')
      expect(result.data.user.profile.bio).toContain('translated_')
      expect(result.data.tags[0]).toContain('translated_')
      expect(result.data.tags[1]).toContain('translated_')
    })

    it('应该成功翻译包含HTML的内容', async () => {
      const data = {
        content: '<div>你好<span>世界</span></div>',
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.content).toContain('translated_')
      expect(result.data.content).toContain('<div>')
      expect(result.data.content).toContain('</div>')
    })
  })

  describe('空数据处理', () => {
    it('应该处理 null 数据', async () => {
      const result = await translateDataRecursively(null, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(null)
      expect(result.cacheStats).toEqual({ hits: 0, total: 0 })
    })

    it('应该处理 undefined 数据', async () => {
      const result = await translateDataRecursively(undefined, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(undefined)
      expect(result.cacheStats).toEqual({ hits: 0, total: 0 })
    })

    it('应该处理空对象', async () => {
      const result = await translateDataRecursively({}, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual({})
    })

    it('应该处理空数组', async () => {
      const result = await translateDataRecursively([], mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it('应该处理没有可翻译内容的数据', async () => {
      const data = {
        id: 123,
        count: 456,
        active: true,
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
      expect(result.cacheStats).toEqual({ hits: 0, total: 0 })
      expect(mockApiTranslate).not.toHaveBeenCalled()
    })
  })

  describe('缓存功能', () => {
    it('应该利用缓存避免重复翻译', async () => {
      const data1 = { name: '测试公司' }
      const data2 = { name: '测试公司' }

      // 第一次翻译
      await translateDataRecursively(data1, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      })

      mockApiTranslate.mockClear()

      // 第二次翻译应该使用缓存
      const result = await translateDataRecursively(data2, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      })

      expect(result.success).toBe(true)
      expect(mockApiTranslate).not.toHaveBeenCalled()
      expect(result.cacheStats?.hits).toBeGreaterThan(0)
    })

    it('禁用缓存时每次都应该调用API', async () => {
      const data = { name: '测试公司' }

      await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      mockApiTranslate.mockClear()

      await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(mockApiTranslate).toHaveBeenCalled()
    })

    it('应该正确报告缓存命中统计', async () => {
      const data = {
        field1: '文本1',
        field2: '文本2',
        field3: '文本3',
      }

      // 第一次翻译
      await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      })

      // 第二次翻译，部分缓存命中
      const newData = {
        field1: '文本1', // 缓存命中
        field2: '文本2', // 缓存命中
        field4: '文本4', // 新文本
      }

      const result = await translateDataRecursively(newData, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: true,
      })

      expect(result.success).toBe(true)
      expect(result.cacheStats?.hits).toBe(2)
      expect(result.cacheStats?.total).toBe(3)
    })
  })

  describe('文本过滤', () => {
    it('应该使用自定义 textFilter', async () => {
      const data = {
        chinese: '中文内容',
        english: 'English content',
        mixed: '混合Mixed',
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        textFilter: (text) => text.includes('中'),
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.chinese).toContain('translated_')
      expect(result.data.english).toBe('English content') // 未翻译
      expect(result.data.mixed).toBe('混合Mixed') // 未翻译
    })

    it('应该过滤纯数字和符号', async () => {
      const data = {
        text: '测试文本',
        number: '123',
        symbol: '$%^&',
        mixed: '价格100',
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.text).toContain('translated_')
      expect(result.data.number).toBe('123') // 未翻译
      expect(result.data.symbol).toBe('$%^&') // 未翻译
      expect(result.data.mixed).toContain('translated_') // 包含文字，应翻译
    })
  })

  describe('分块处理', () => {
    it('应该按 chunkSize 分块处理大量文本', async () => {
      const data = Array.from({ length: 100 }, (_, i) => `文本${i}`)

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        chunkSize: 20,
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(mockApiTranslate).toHaveBeenCalledTimes(5) // 100 / 20 = 5 次
      expect(result.data).toHaveLength(100)
    })

    it('应该使用默认 chunkSize 50', async () => {
      const data = Array.from({ length: 120 }, (_, i) => `文本${i}`)

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(mockApiTranslate).toHaveBeenCalledTimes(3) // 120 / 50 = 2.4 向上取整为 3
    })
  })

  describe('错误处理', () => {
    it('API 失败时应该返回原始数据', async () => {
      const failingApi = vi.fn(async () => {
        throw new Error('API Error')
      })

      const data = { name: '测试' }

      const result = await translateDataRecursively(data, failingApi, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error?.message).toContain('API Error')
      expect(result.data).toEqual(data) // 返回原始数据
    })

    it('部分请求失败应该标记为失败', async () => {
      let callCount = 0
      const partialFailApi = vi.fn(async (params: Record<string, string>) => {
        callCount++
        if (callCount === 1) {
          return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, `translated_${v}`]))
        }
        throw new Error('Second batch failed')
      })

      const data = Array.from({ length: 60 }, (_, i) => `文本${i}`)

      const result = await translateDataRecursively(data, partialFailApi, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        chunkSize: 50,
        enableCache: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('应该捕获和处理意外异常', async () => {
      const data = { name: '测试' }

      // 模拟一个抛出非 Error 对象的情况
      const weirdApi = vi.fn(async () => {
        throw 'String error'
      })

      const result = await translateDataRecursively(data, weirdApi, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.data).toEqual(data)
    })
  })

  describe('数据完整性', () => {
    it('应该保持原始数据的类型和结构', async () => {
      const data = {
        id: 123,
        name: '测试',
        active: true,
        count: 0,
        nullable: null,
        arr: [1, 2, 3],
        nested: {
          value: '嵌套',
        },
      }

      const result = await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(typeof result.data.id).toBe('number')
      expect(result.data.id).toBe(123)
      expect(typeof result.data.active).toBe('boolean')
      expect(result.data.active).toBe(true)
      expect(result.data.count).toBe(0)
      expect(result.data.nullable).toBe(null)
      expect(Array.isArray(result.data.arr)).toBe(true)
      expect(result.data.arr).toEqual([1, 2, 3])
    })

    it('不应该修改原始数据', async () => {
      const data = {
        name: '测试',
        items: ['项目1', '项目2'],
      }

      const originalData = JSON.parse(JSON.stringify(data))

      await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(data).toEqual(originalData)
    })
  })

  describe('去重处理', () => {
    it('应该对重复文本只翻译一次', async () => {
      const data = {
        field1: '测试',
        field2: '测试',
        field3: '测试',
        field4: '其他',
      }

      await translateDataRecursively(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      // 检查 API 调用，应该只传递 2 个不同的文本
      const allParams = mockApiTranslate.mock.calls.flatMap((call) => Object.values(call[0]))
      const uniqueParams = [...new Set(allParams)]
      expect(uniqueParams).toHaveLength(2)
      expect(uniqueParams).toContain('测试')
      expect(uniqueParams).toContain('其他')
    })
  })
})

