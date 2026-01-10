import { describe, expect, test } from 'vitest'
import { formatUTCDate } from '@/format/time'

describe('formatUTCDate', () => {
  test('pads month, day, hour, minute, second to two digits', () => {
    const d = new Date(2020, 0, 2, 3, 4, 5)
    expect(formatUTCDate(d)).toBe('2020-01-02 03:04:05')
  })

  test('accepts timestamp number', () => {
    const ts = new Date(2020, 10, 9, 8, 7, 6).getTime()
    expect(formatUTCDate(ts)).toBe('2020-11-09 08:07:06')
  })

  test('returns placeholder when input is empty', () => {
    expect(formatUTCDate(undefined)).toBe('--')
    expect(formatUTCDate('')).toBe('--')
  })
})
