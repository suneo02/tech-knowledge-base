import { formatMoney } from '../currency.ts'

describe('formatMoney', () => {
  // 1. 测试无效输入
  describe('invalid inputs', () => {
    test('should handle null and undefined', () => {
      expect(formatMoney(null)).toBe('--')
      expect(formatMoney(undefined)).toBe('--')
    })

    test('should handle invalid string inputs', () => {
      expect(formatMoney('abc')).toBe('--')
      expect(formatMoney('')).toBe('--')
      expect(formatMoney('NaN')).toBe('--')
    })

    test('should handle zero', () => {
      expect(formatMoney(0)).toBe('--')
      expect(formatMoney('0')).toBe('--')
    })
  })

  // 2. 测试基本格式化
  describe('basic formatting', () => {
    test('should format integers without decimals', () => {
      expect(formatMoney(10000)).toBe('10,000')
      expect(formatMoney(1234567)).toBe('1,234,567')
    })

    test('should format numbers with decimals', () => {
      expect(formatMoney(10000.123)).toBe('10,000.123')
      expect(formatMoney('1234.567')).toBe('1,234.567')
    })

    test('should handle negative numbers', () => {
      expect(formatMoney(-10000)).toBe('-10,000')
      expect(formatMoney(-1234.56)).toBe('-1,234.56')
    })
  })

  // 3. 测试小数位数
  describe('decimal places', () => {
    test('should respect specified decimal places', () => {
      expect(formatMoney(10000.123, { decimalPlaces: 2 })).toBe('10,000.12')
      expect(formatMoney(10000.123, { decimalPlaces: 0 })).toBe('10,000')
      expect(formatMoney(10000, { decimalPlaces: 2 })).toBe('10,000.00')
    })

    test('should handle string numbers with decimal places', () => {
      expect(formatMoney('10000.123', { decimalPlaces: 2 })).toBe('10,000.12')
      expect(formatMoney('10000.1', { decimalPlaces: 3 })).toBe('10,000.100')
    })
  })

  // 4. 测试缩放
  describe('scaling', () => {
    test('should handle different scales', () => {
      expect(formatMoney(10000, { scale: 1000 })).toBe('10')
      expect(formatMoney(10000, { scale: 100 })).toBe('100')
      expect(formatMoney(10000.5, { scale: 1000 })).toBe('10.0005')
    })

    test('should handle scale with decimal places', () => {
      expect(formatMoney(10000, { scale: 1000, decimalPlaces: 2 })).toBe('10.00')
      expect(formatMoney(10500, { scale: 1000, decimalPlaces: 1 })).toBe('10.5')
    })
  })

  // 5. 测试单位显示
  describe('unit display', () => {
    test('should show unit when showUnit is true', () => {
      expect(formatMoney(10000, { showUnit: true, unit: '万' })).toBe('10,000万')
      expect(formatMoney(10000, { showUnit: true, unit: '元' })).toBe('10,000元')
    })

    test('should not show unit when showUnit is false', () => {
      expect(formatMoney(10000, { showUnit: false })).toBe('10,000')
    })
  })

  // 6. 测试组合场景
  describe('combination scenarios', () => {
    test('should handle scale, decimal places and unit together', () => {
      expect(
        formatMoney(10000, {
          scale: 1000,
          decimalPlaces: 2,
          showUnit: true,
          unit: '万',
        })
      ).toBe('10.00万')
    })

    test('should handle negative numbers with all options', () => {
      expect(
        formatMoney(-10000.123, {
          scale: 1000,
          decimalPlaces: 3,
          showUnit: true,
          unit: '万',
        })
      ).toBe('-10.000万')
    })

    test('should handle string numbers with all options', () => {
      expect(
        formatMoney('10000.123', {
          scale: 100,
          decimalPlaces: 1,
          showUnit: true,
          unit: '元',
        })
      ).toBe('100.0元')
    })
  })

  // 7. 测试默认值
  describe('default values', () => {
    test('should use default scale of 1', () => {
      expect(formatMoney(10000)).toBe('10,000')
    })

    test('should use default showUnit of false', () => {
      expect(formatMoney(10000)).toBe('10,000')
    })

    test('should use input decimal places when not specified', () => {
      expect(formatMoney('10000.123')).toBe('10,000.123')
    })
  })
})
