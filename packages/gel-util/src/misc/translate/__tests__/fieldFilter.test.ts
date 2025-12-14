import { beforeEach, describe, expect, it, vi } from 'vitest'
import { globalCacheManager } from '../cacheManager'
import { translateDataByFields } from '../fieldFilter'

describe('fieldFilter - translateDataByFields', () => {
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

  describe('skipFields 功能', () => {
    it('应该跳过指定的一级字段', async () => {
      const data = {
        id: '公司ID',
        name: '公司名称',
        description: '公司描述',
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id', 'name'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.id).toBe('公司ID') // 未翻译
      expect(result.data.name).toBe('公司名称') // 未翻译
      expect(result.data.description).toContain('translated_') // 已翻译
    })

    it('应该在数组元素上应用 skipFields', async () => {
      const data = [
        { id: 'ID1', name: '名称1', desc: '描述1' },
        { id: 'ID2', name: '名称2', desc: '描述2' },
      ]

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id', 'name'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data[0].id).toBe('ID1')
      expect(result.data[0].name).toBe('名称1')
      expect(result.data[0].desc).toContain('translated_')
      expect(result.data[1].id).toBe('ID2')
      expect(result.data[1].name).toBe('名称2')
      expect(result.data[1].desc).toContain('translated_')
    })

    it('未配置 skipFields 时应该翻译所有字段', async () => {
      const data = {
        field1: '文本1',
        field2: '文本2',
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.field1).toContain('translated_')
      expect(result.data.field2).toContain('translated_')
    })
  })

  describe('allowFields 功能', () => {
    it('应该只翻译允许的字段', async () => {
      const data = {
        id: '公司ID',
        name: '公司名称',
        description: '公司描述',
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        allowFields: ['description'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.id).toBe('公司ID') // 未翻译
      expect(result.data.name).toBe('公司名称') // 未翻译
      expect(result.data.description).toContain('translated_') // 已翻译
    })

    it('allowFields 应该优先于 skipFields', async () => {
      const data = {
        field1: '文本1',
        field2: '文本2',
        field3: '文本3',
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['field1', 'field2'],
        allowFields: ['field1', 'field3'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.field1).toContain('translated_') // allowFields 优先，应该翻译
      expect(result.data.field2).toBe('文本2') // 不在 allowFields 中，不翻译
      expect(result.data.field3).toContain('translated_') // 在 allowFields 中，翻译
    })

    it('应该在数组元素上应用 allowFields', async () => {
      const data = [
        { id: 'ID1', name: '名称1', desc: '描述1' },
        { id: 'ID2', name: '名称2', desc: '描述2' },
      ]

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        allowFields: ['desc'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data[0].id).toBe('ID1')
      expect(result.data[0].name).toBe('名称1')
      expect(result.data[0].desc).toContain('translated_')
    })
  })

  describe('嵌套结构处理', () => {
    it('应该处理嵌套对象', async () => {
      const data = {
        id: '标识',
        name: '名称',
        user: {
          desc: '用户描述',
          address: '用户地址',
          profile: {
            bio: '个人简介',
            location: '位置',
          },
        },
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id', 'name'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      // 顶层的 id 和 name 不翻译
      expect(result.data.id).toBe('标识')
      expect(result.data.name).toBe('名称')
      // 嵌套对象 user 不在 skipFields 中，其内部字段应该被翻译
      expect(result.data.user.desc).toContain('translated_')
      expect(result.data.user.address).toContain('translated_')
      expect(result.data.user.profile.bio).toContain('translated_')
      expect(result.data.user.profile.location).toContain('translated_')
    })

    it('应该处理数组嵌套对象', async () => {
      const data = {
        users: [
          { id: 'ID1', desc: '描述1' },
          { id: 'ID2', desc: '描述2' },
        ],
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.users[0].id).toBe('ID1')
      expect(result.data.users[0].desc).toContain('translated_')
      expect(result.data.users[1].id).toBe('ID2')
      expect(result.data.users[1].desc).toContain('translated_')
    })
  })

  describe('边界情况', () => {
    it('应该处理空数据', async () => {
      const result = await translateDataByFields(null, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(null)
    })

    it('应该处理 undefined 数据', async () => {
      const result = await translateDataByFields(undefined, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe(undefined)
    })

    it('应该处理空对象', async () => {
      const result = await translateDataByFields({}, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual({})
    })

    it('应该处理空数组', async () => {
      const result = await translateDataByFields([], mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it('应该处理原始类型数据', async () => {
      const result = await translateDataByFields('测试文本', mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data).toContain('translated_')
    })

    it('应该处理数组原始类型', async () => {
      const data = ['测试1', '测试2', '测试3']

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'], // 对原始类型数组不生效
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data[0]).toContain('translated_')
      expect(result.data[1]).toContain('translated_')
      expect(result.data[2]).toContain('translated_')
    })

    it('应该处理空的 skipFields', async () => {
      const data = { field: '文本' }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: [],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.field).toContain('translated_')
    })

    it('应该处理空的 allowFields', async () => {
      const data = { field: '文本' }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        allowFields: [],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.field).toContain('translated_')
    })

    it('应该处理不存在的字段名', async () => {
      const data = {
        field1: '文本1',
        field2: '文本2',
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['nonexistent'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.field1).toContain('translated_')
      expect(result.data.field2).toContain('translated_')
    })
  })

  describe('错误处理', () => {
    it('应该处理翻译失败的情况', async () => {
      const failingApi = vi.fn(async () => {
        throw new Error('API Error')
      })

      const data = {
        name: '测试',
        description: '描述',
      }

      const result = await translateDataByFields(data, failingApi, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['name'],
        enableCache: false,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.data).toEqual(data) // 返回原始数据
    })

    it('捕获异常时应该返回原始数据', async () => {
      const data = { field: '测试' }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        // @ts-expect-error: 测试错误处理
        skipFields: 'invalid',
        enableCache: false,
      })

      // 应该能够处理或返回数据
      expect(result.data).toBeDefined()
    })
  })

  describe('保持数据完整性', () => {
    it('应该保持原始对象的其他属性', async () => {
      const data = {
        id: 123,
        name: '测试',
        active: true,
        count: 456,
        metadata: { key: 'value' },
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.id).toBe(123)
      expect(result.data.active).toBe(true)
      expect(result.data.count).toBe(456)
      expect(result.data.metadata).toEqual({ key: 'value' })
    })

    it('合并后数据应该保持正确的引用结构', async () => {
      const data = {
        id: 'ID',
        name: '名称',
        items: [
          { id: 'item1', desc: '描述1' },
          { id: 'item2', desc: '描述2' },
        ],
      }

      const result = await translateDataByFields(data, mockApiTranslate, {
        sourceLocale: 'zh-CN',
        targetLocale: 'en-US',
        skipFields: ['id'],
        enableCache: false,
      })

      expect(result.success).toBe(true)
      expect(result.data.id).toBe('ID')
      expect(Array.isArray(result.data.items)).toBe(true)
      expect(result.data.items).toHaveLength(2)
      expect(result.data.items[0].id).toBe('item1')
      expect(result.data.items[1].id).toBe('item2')
    })
  })
})
