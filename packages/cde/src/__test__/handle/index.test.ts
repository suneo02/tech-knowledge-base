import { CDEFilterItemUser } from '@/types'
import { describe, expect, it } from 'vitest'
import { isValidUserFilterItem } from '../../handle/index'

describe('isValidUserFilterItem', () => {
  // 测试 null 和 undefined 的情况
  it('should return false for null or undefined', () => {
    expect(isValidUserFilterItem(null as any)).toBe(false)
    expect(isValidUserFilterItem(undefined as any)).toBe(false)
  })

  // 测试 value 为数组的情况
  describe('when value is array', () => {
    it('should return true for non-empty array', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: ['test1', 'test2'],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(true)
    })

    it('should return false for empty array', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: [],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })
  })

  // 测试 value 为字符串的情况
  describe('when value is string', () => {
    it('should return true for non-empty string', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: 'test',
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(true)
    })

    it('should return false for empty string', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: '',
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })

    it('should return false for string with only whitespace', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: '   ',
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })
  })

  // 测试 search 字段的情况
  describe('when search field exists', () => {
    it('should return true when search has valid value', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        search: ['valid search'],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(true)
    })

    it('should return false when search is empty', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        search: [],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })

    it('should return false when search contains only whitespace', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        search: ['   '],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })
  })

  // 测试同时存在 value 和 search 的情况
  describe('when both value and search exist', () => {
    it('should return true when both are valid', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: 'test value',
        search: ['test search'],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(true)
    })

    it('should return false when search is invalid even if value is valid', () => {
      const item: CDEFilterItemUser = {
        itemId: 1,
        field: 'test',
        value: 'test value',
        search: ['   '],
        title: 'test',
      }
      expect(isValidUserFilterItem(item)).toBe(false)
    })
  })
})
