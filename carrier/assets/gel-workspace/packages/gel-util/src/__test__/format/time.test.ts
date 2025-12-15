import { formatTime, formatTimeIntl } from '@/format/time'
import { isEn } from '@/intl'
import { beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('@/intl')

describe('formatTime', () => {
  // 1. 测试基本格式
  describe('basic formats', () => {
    test('should handle year format (YYYY)', () => {
      expect(formatTime('2010')).toBe('2010')
    })

    test('should handle year-month format (YYYY-M or YYYY-MM)', () => {
      expect(formatTime('2010-1')).toBe('2010-1')
      expect(formatTime('2010-01')).toBe('2010-01')
    })

    test('should handle year-month-day format (YYYY-M-D or YYYY-MM-DD)', () => {
      expect(formatTime('2010-1-1')).toBe('2010-1-1')
      expect(formatTime('2010-01-01')).toBe('2010-01-01')
    })
  })

  // 2. 测试日期转换
  describe('date conversions', () => {
    test('should convert YYYYMMDD format', () => {
      expect(formatTime('20100101')).toBe('2010-01-01')
    })

    test('should convert YYYYMM format', () => {
      expect(formatTime('202002')).toBe('2020-02')
    })

    test('should handle date with slashes', () => {
      expect(formatTime('2010/01/01')).toBe('2010-01-01')
    })
  })

  // 3. 测试时间戳格式
  describe('timestamp formats', () => {
    test('should handle ISO format', () => {
      expect(formatTime('2010-01-01T00:00:00')).toBe('2010-01-01')
    })

    test('should handle datetime format', () => {
      expect(formatTime('2010-01-01 12:00:00')).toBe('2010-01-01')
    })
  })

  // 4. 测试日期范围
  describe('date ranges', () => {
    test('should handle date range format', () => {
      expect(formatTime('20100101至20101231')).toBe('2010-01-01至2010-12-31')
    })
  })

  // 5. 测试特殊情况
  describe('special cases', () => {
    test('should handle null and undefined', () => {
      expect(formatTime(null as any)).toBe('--')
      expect(formatTime(undefined as any)).toBe('--')
    })

    test('should handle empty string', () => {
      expect(formatTime('')).toBe('--')
    })

    test('should handle "0"', () => {
      expect(formatTime('0')).toBe('--')
    })

    test('should handle invalid date strings', () => {
      expect(formatTime('invalid')).toBe('invalid')
    })
  })
})

describe('formatTimeIntl', () => {
  // 1. 测试中文格式
  describe('Chinese format', () => {
    beforeEach(() => {
      vi.mocked(isEn).mockReturnValue(false)
    })

    test('should format date in Chinese', () => {
      expect(formatTimeIntl('2010-01-01')).toBe('2010年01月01日')
    })

    test('should handle invalid date', () => {
      expect(formatTimeIntl(null as any)).toBe('--')
      expect(formatTimeIntl(undefined as any)).toBe('--')
      expect(formatTimeIntl('')).toBe('--')
    })
  })

  // 2. 测试英文格式
  describe('English format', () => {
    beforeEach(() => {
      vi.mocked(isEn).mockReturnValue(true)
    })

    test('should format date in English', () => {
      expect(formatTimeIntl('2010-01-01')).toBe('2010-01-01')
    })

    test('should handle invalid date', () => {
      expect(formatTimeIntl(null as any)).toBe('--')
      expect(formatTimeIntl(undefined as any)).toBe('--')
      expect(formatTimeIntl('')).toBe('--')
    })
  })
})
