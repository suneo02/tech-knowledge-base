import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getAllUrlSearch, getUrlSearchValue, stringifyObjectToParams } from '../../common/url'

describe('URL Parameter Utilities', () => {
  // 保存并恢复 window.location
  const originalWindow = window.location

  beforeEach(() => {
    // 模拟 window.location
    delete (window as any).location
    // @ts-ignore
    window.location = {
      ...originalWindow,
      href: 'http://example.com',
    }
  })

  afterEach(() => {
    // @ts-ignore
    window.location = originalWindow
  })

  describe('getAllUrlSearch', () => {
    it('应该正确解析 hash 前后的参数', () => {
      const url = 'http://example.com?before=1#/path?after=2'
      const params = getAllUrlSearch(url)

      expect(params.before).toBe('1')
      expect(params.after).toBe('2')
    })

    it('hash 后的参数应该覆盖 hash 前的同名参数', () => {
      const url = 'http://example.com?param=1#/path?param=2'
      const params = getAllUrlSearch(url)

      expect(params.param).toBe('2')
    })

    it('应该处理没有参数的 URL', () => {
      const url = 'http://example.com'
      const params = getAllUrlSearch(url)

      expect(Object.keys(params).length).toBe(0)
    })

    it('应该处理只有 hash 前参数的 URL', () => {
      const url = 'http://example.com?param=1#/path'
      const params = getAllUrlSearch(url)

      expect(params.param).toBe('1')
    })

    it('应该处理只有 hash 后参数的 URL', () => {
      const url = 'http://example.com#/path?param=1'
      const params = getAllUrlSearch(url)

      expect(params.param).toBe('1')
    })

    it('应该在 URL 无效时返回空的 URLSearchParams', () => {
      const url = 'invalid-url'
      const params = getAllUrlSearch(url)

      expect(Object.keys(params).length).toBe(0)
    })

    it('应该处理特殊字符', () => {
      const url = 'http://example.com?message=Hello%20%26%20World#/path?tag=%E4%B8%AD%E6%96%87'
      const params = getAllUrlSearch(url)

      expect(params.tag).toBe('中文')
    })
  })

  describe('stringifyObjectToParams', () => {
    it('应该正确序列化简单对象', () => {
      const obj = { key: 'value', number: 123 }
      const result = stringifyObjectToParams(obj)

      expect(result).toBe('key=value&number=123')
    })

    it('应该正确序列化包含特殊字符的值', () => {
      const obj = {
        message: 'Hello & World',
        tag: '中文',
      }
      const result = stringifyObjectToParams(obj)

      expect(decodeURIComponent(result)).toBe('message=Hello & World&tag=中文')
    })

    it('应该返回空字符串当传入空对象时', () => {
      const result = stringifyObjectToParams({})

      expect(result).toBe('')
    })

    it('应该正确处理 null 和 undefined 值', () => {
      const obj = {
        nullValue: null,
        undefinedValue: undefined,
        validValue: 'test',
      }
      const result = stringifyObjectToParams(obj)

      expect(result).toBe('nullValue&validValue=test')
    })
  })

  describe('getUrlSearchValue', () => {
    it('should return the value of an existing parameter', () => {
      window.location.href = 'http://example.com?name=Alice&age=30'
      expect(getUrlSearchValue('name')).toBe('Alice')
    })

    it('should be case-insensitive when searching for a parameter', () => {
      window.location.href = 'http://example.com?Name=Bob'
      expect(getUrlSearchValue('name')).toBe('Bob')
      expect(getUrlSearchValue('NAME')).toBe('Bob')
    })

    it('should return undefined for a non-existent parameter', () => {
      window.location.href = 'http://example.com?name=Charlie'
      expect(getUrlSearchValue('age')).toBeUndefined()
    })

    it('should return undefined if the parameter name is empty or whitespace', () => {
      window.location.href = 'http://example.com?name=David'
      expect(getUrlSearchValue('')).toBeUndefined()
      expect(getUrlSearchValue('   ')).toBeUndefined()
    })

    it('should correctly get parameters from the hash part of the URL', () => {
      window.location.href = 'http://example.com?name=Eve#/path?role=admin'
      expect(getUrlSearchValue('role')).toBe('admin')
    })

    it('hash parameter should overwrite search parameter', () => {
      window.location.href = 'http://example.com?name=Frank#/path?name=Grace'
      expect(getUrlSearchValue('name')).toBe('Grace')
    })
  })
})
