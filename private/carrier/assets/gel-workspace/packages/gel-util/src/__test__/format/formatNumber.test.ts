import { formatNumber } from '@/format'
import { describe, expect, test, vi } from 'vitest'

describe('formatNumber', () => {
  // 基础格式化测试
  describe('basic formatting', () => {
    test('should format integer number correctly', () => {
      expect(formatNumber(1000)).toBe('1,000')
    })

    test('should format decimal number correctly', () => {
      expect(formatNumber(1000.5)).toBe('1,000.5')
    })

    test('should format string number correctly', () => {
      expect(formatNumber('1000')).toBe('1,000')
      expect(formatNumber('1000.5')).toBe('1,000.5')
    })
  })

  // 无效输入测试
  describe('invalid inputs', () => {
    test('should return -- for null', () => {
      expect(formatNumber(null as any)).toBe('--')
    })

    test('should return -- for undefined', () => {
      expect(formatNumber(undefined as any)).toBe('--')
    })

    test('should return -- for NaN', () => {
      expect(formatNumber(NaN)).toBe('--')
    })

    test('should return 0 for zero', () => {
      expect(formatNumber(0)).toBe('0')
    })

    test('should return -- for invalid strings', () => {
      expect(formatNumber('abc')).toBe('--')
    })
  })

  // 小数位数测试
  describe('decimal places', () => {
    test('should respect decimalPlaces option', () => {
      expect(formatNumber(1000.5678, { decimalPlaces: 2 })).toBe('1,000.57')
      expect(formatNumber(1000, { decimalPlaces: 2 })).toBe('1,000.00')
      expect(formatNumber(1000.5, { decimalPlaces: 0 })).toBe('1,001')
    })

    test('should handle rounding correctly', () => {
      expect(formatNumber(1000.499, { decimalPlaces: 2 })).toBe('1,000.50')
      expect(formatNumber(1000.499, { decimalPlaces: 0 })).toBe('1,000')
      expect(formatNumber(1000.5, { decimalPlaces: 0 })).toBe('1,001')
    })
  })

  // 缩放比例测试
  describe('scale', () => {
    test('should apply scale factor correctly', () => {
      expect(formatNumber(10000, { scale: 10000 })).toBe('1')
      expect(formatNumber(10000, { scale: 1000 })).toBe('10')
      expect(formatNumber(1500000, { scale: 10000, decimalPlaces: 2 })).toBe('150.00')
    })

    test('should apply scale and format with units', () => {
      expect(formatNumber(10000, { scale: 10000, showUnit: true, unit: '万' })).toBe('1万')
      expect(formatNumber(10000, { scale: 1000, showUnit: true, unit: '千' })).toBe('10千')
    })
  })

  // 单位测试
  describe('units', () => {
    test('should append unit when showUnit is true', () => {
      expect(formatNumber(1000, { showUnit: true, unit: '元' })).toBe('1,000元')
      expect(formatNumber(1000, { showUnit: true, unit: '人' })).toBe('1,000人')
    })

    test('should not append unit when showUnit is false', () => {
      expect(formatNumber(1000, { showUnit: false, unit: '元' })).toBe('1,000')
    })

    test('should not append unit when unit is not provided', () => {
      expect(formatNumber(1000, { showUnit: true })).toBe('--')
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      formatNumber(1000, { showUnit: true })
      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  // 千分位分隔符测试
  describe('thousand separators', () => {
    test('should use thousand separators by default', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    test('should not use thousand separators when useThousandSeparator is false', () => {
      expect(formatNumber(1000, { useThousandSeparator: false })).toBe('1000')
      expect(formatNumber(1000000, { useThousandSeparator: false })).toBe('1000000')
    })

    test('should format with decimal places and without thousand separators', () => {
      expect(formatNumber(1000.56, { decimalPlaces: 2, useThousandSeparator: false })).toBe('1000.56')
    })
  })

  // 科学计数法处理测试
  describe('scientific notation', () => {
    test('should handle scientific notation correctly', () => {
      expect(formatNumber(1e6)).toBe('1,000,000')
      expect(formatNumber(1.5e6)).toBe('1,500,000')
    })

    test('should handle very small numbers in scientific notation', () => {
      expect(formatNumber(1e-6, { decimalPlaces: 8 })).toBe('0.00000100')
    })
  })

  // 组合选项测试
  describe('combined options', () => {
    test('should handle all options together', () => {
      expect(
        formatNumber(1234567.89, {
          decimalPlaces: 2,
          scale: 1000,
          useThousandSeparator: true,
          showUnit: true,
          unit: 'k',
        })
      ).toBe('1,234.57k')
    })

    test('should handle scale and no thousand separators', () => {
      expect(
        formatNumber(1234567.89, {
          decimalPlaces: 2,
          scale: 1000,
          useThousandSeparator: false,
          showUnit: true,
          unit: 'k',
        })
      ).toBe('1234.57k')
    })
  })

  // 错误处理测试
  describe('error handling', () => {
    test('should return -- when an error occurs', () => {
      const originalParseFloat = global.parseFloat
      global.parseFloat = () => {
        throw new Error('Test error')
      }
      expect(formatNumber('1000')).toBe('--')
      global.parseFloat = originalParseFloat
    })

    test('should log error when an error occurs', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const originalParseFloat = global.parseFloat
      global.parseFloat = () => {
        throw new Error('Test error')
      }
      formatNumber('1000')
      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
      global.parseFloat = originalParseFloat
    })
  })
})
