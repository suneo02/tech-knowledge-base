import { formatPercent, formatPercentWithTwoDecimalWhenZero } from '../percentage.ts'

describe('displayPercent', () => {
  test('should handle null and undefined', () => {
    expect(formatPercent(null)).toBe('--')
    expect(formatPercent(undefined)).toBe('--')
  })

  test('should handle normal numbers', () => {
    expect(formatPercent(50)).toBe('50%')
    expect(formatPercent('75')).toBe('75%')
  })

  test('should handle strings with percent sign', () => {
    expect(formatPercent('80%')).toBe('80%')
  })

  test('should handle invalid inputs', () => {
    expect(formatPercent('abc')).toBe('--')
    expect(formatPercent('')).toBe('--')
  })
})

describe('displayPercentWithTwoDecimalWhenZero', () => {
  test('should handle zero', () => {
    expect(formatPercentWithTwoDecimalWhenZero(0)).toBe('0.00%')
  })

  test('should handle non-zero numbers', () => {
    expect(formatPercentWithTwoDecimalWhenZero(50)).toBe('50%')
  })
})
