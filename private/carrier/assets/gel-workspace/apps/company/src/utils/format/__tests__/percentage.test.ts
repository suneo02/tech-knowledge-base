import { describe, expect, it } from 'vitest'
import { formatShareRate } from '../percentage'

describe('formatShareRate', () => {
  it('应该为数字添加百分号', () => {
    expect(formatShareRate('25.5')).toBe('25.5%')
    expect(formatShareRate('100')).toBe('100%')
    expect(formatShareRate('0.5')).toBe('0.5%')
  })

  it('应该处理已经包含百分号的值', () => {
    expect(formatShareRate('25.5%')).toBe('25.5%')
    expect(formatShareRate('100%')).toBe('100%')
  })

  it('应该处理空值和特殊值', () => {
    expect(formatShareRate(null)).toBe('--')
    expect(formatShareRate(undefined)).toBe('--')
    expect(formatShareRate('')).toBe('--')
    expect(formatShareRate('--')).toBe('--')
  })

  it('应该处理数字类型', () => {
    expect(formatShareRate(25.5)).toBe('25.5%')
    expect(formatShareRate(100)).toBe('100%')
    expect(formatShareRate(0)).toBe('0%')
  })
})
