import { describe, expect, it } from 'vitest'
import { API_KEY_SEPARATOR, API_KEY_SUFFIX, generateApiKey, parseApiKey, sortApiKeys } from '../apiKeyUtils'

describe('apiKeyUtils - API 键名工具函数', () => {
  describe('常量定义', () => {
    it('应该定义正确的分隔符', () => {
      expect(API_KEY_SEPARATOR).toBe('$$')
    })

    it('应该定义正确的后缀', () => {
      expect(API_KEY_SUFFIX).toBe('word')
    })
  })

  describe('generateApiKey - 生成 API 键名', () => {
    it('应该生成正确格式的键名', () => {
      expect(generateApiKey(0)).toBe('0$$word')
      expect(generateApiKey(1)).toBe('1$$word')
      expect(generateApiKey(42)).toBe('42$$word')
    })

    it('应该处理大索引值', () => {
      expect(generateApiKey(999)).toBe('999$$word')
      expect(generateApiKey(10000)).toBe('10000$$word')
    })

    it('应该处理负数索引', () => {
      expect(generateApiKey(-1)).toBe('-1$$word')
    })
  })

  describe('parseApiKey - 解析 API 键名', () => {
    it('应该正确解析合法的键名', () => {
      expect(parseApiKey('0$$word')).toBe(0)
      expect(parseApiKey('1$$word')).toBe(1)
      expect(parseApiKey('42$$word')).toBe(42)
      expect(parseApiKey('999$$word')).toBe(999)
    })

    it('应该对非法格式返回 null', () => {
      expect(parseApiKey('invalid')).toBeNull()
      expect(parseApiKey('0-word')).toBeNull()
      expect(parseApiKey('0$$test')).toBeNull()
      expect(parseApiKey('$$word')).toBeNull()
    })

    it('应该对包含多个分隔符的键名返回 null', () => {
      expect(parseApiKey('0$$1$$word')).toBeNull()
    })

    it('应该对非数字索引返回 null', () => {
      expect(parseApiKey('abc$$word')).toBeNull()
    })

    it('应该处理负数索引', () => {
      expect(parseApiKey('-1$$word')).toBe(-1)
      expect(parseApiKey('-42$$word')).toBe(-42)
    })
  })

  describe('sortApiKeys - 按索引排序键名', () => {
    it('应该按索引升序排列', () => {
      const keys = ['10$$word', '2$$word', '1$$word', '5$$word']
      const sorted = sortApiKeys(keys)
      expect(sorted).toEqual(['1$$word', '2$$word', '5$$word', '10$$word'])
    })

    it('应该正确处理大数字排序', () => {
      const keys = ['100$$word', '20$$word', '3$$word']
      const sorted = sortApiKeys(keys)
      expect(sorted).toEqual(['3$$word', '20$$word', '100$$word'])
    })

    it('应该处理已排序的数组', () => {
      const keys = ['1$$word', '2$$word', '3$$word']
      const sorted = sortApiKeys(keys)
      expect(sorted).toEqual(['1$$word', '2$$word', '3$$word'])
    })

    it('应该处理空数组', () => {
      expect(sortApiKeys([])).toEqual([])
    })

    it('应该处理单个元素', () => {
      expect(sortApiKeys(['42$$word'])).toEqual(['42$$word'])
    })

    it('应该正确处理包含非法键名的数组', () => {
      const keys = ['10$$word', 'invalid', '2$$word']
      const sorted = sortApiKeys(keys)
      // 非法键名会被解析为 0 或保持位置
      expect(sorted).toContain('10$$word')
      expect(sorted).toContain('2$$word')
      expect(sorted).toContain('invalid')
    })

    it('应该处理负数索引', () => {
      const keys = ['5$$word', '-1$$word', '0$$word', '-10$$word']
      const sorted = sortApiKeys(keys)
      expect(sorted).toEqual(['-10$$word', '-1$$word', '0$$word', '5$$word'])
    })
  })

  describe('集成测试', () => {
    it('生成和解析应该是可逆的', () => {
      const indices = [0, 1, 5, 10, 42, 100, 999]
      indices.forEach((index) => {
        const key = generateApiKey(index)
        const parsed = parseApiKey(key)
        expect(parsed).toBe(index)
      })
    })

    it('应该支持完整的生成-排序-解析流程', () => {
      const indices = [10, 2, 5, 1, 20, 3]
      const keys = indices.map(generateApiKey)
      const sortedKeys = sortApiKeys(keys)
      const parsedIndices = sortedKeys.map(parseApiKey)
      expect(parsedIndices).toEqual([1, 2, 3, 5, 10, 20])
    })
  })
})
