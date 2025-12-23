import { debounce, getBrowserLocale, formatCurrency, isArrayAndNotEmpty, isObjectAndNotEmpty } from '../common'

describe('debounce', () => {
  jest.useFakeTimers()

  it('should debounce function calls', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 1000)

    // Call the debounced function multiple times
    debouncedFn('test1')
    debouncedFn('test2')
    debouncedFn('test3')

    // Verify that the mock hasn't been called yet
    expect(mockFn).not.toHaveBeenCalled()

    // Fast forward time
    jest.runAllTimers()

    // Verify that the mock was called only once with the last argument
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('test3')
  })

  it('should cancel previous timer on new calls', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn('test1')
    jest.advanceTimersByTime(500) // Advance halfway
    debouncedFn('test2') // Reset timer
    jest.advanceTimersByTime(500) // Not enough time for second call

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(500) // Complete second timer
    expect(mockFn).toHaveBeenCalledWith('test2')
  })
})

describe('getBrowserLocale', () => {
  const originalNavigator = global.navigator

  afterEach(() => {
    // Restore the original navigator after each test
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    })
  })

  it('should return navigator language when available', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: 'en-US' },
      writable: true,
    })
    expect(getBrowserLocale()).toBe('en-US')
  })

  it('should return zh-CN when navigator is undefined', () => {
    Object.defineProperty(global, 'navigator', {
      value: undefined,
      writable: true,
    })
    expect(getBrowserLocale()).toBe('zh-CN')
  })

  it('should return zh-CN when navigator.language is undefined', () => {
    Object.defineProperty(global, 'navigator', {
      value: { language: undefined },
      writable: true,
    })
    expect(getBrowserLocale()).toBe('zh-CN')
  })
})

describe('formatCurrency', () => {
  // Test cases for number input
  it('should format currency with number input', () => {
    expect(formatCurrency(1000, 0)).toBe('1000')
    expect(formatCurrency(1000.5, 0)).toBe('1000.50')
    expect(formatCurrency(1000.0, 0)).toBe('1000')
  })

  // Test cases for string input
  it('should format currency with string input', () => {
    expect(formatCurrency('1000', 0)).toBe('1000')
    expect(formatCurrency('1000.50', 0)).toBe('1000.50')
  })

  // Test different units
  it('should handle different currency units correctly', () => {
    expect(formatCurrency(1000000, '千元')).toBe('1000')
    expect(formatCurrency(1000000, '万元')).toBe('100')
    expect(formatCurrency(1000000, '百万元')).toBe('1')
    expect(formatCurrency(1000000000, '亿元')).toBe('10')
    expect(formatCurrency(10000000000, '十亿元')).toBe('10')
  })

  // Test decimal handling
  it('should handle decimals correctly', () => {
    expect(formatCurrency(1234.5678, '千元')).toBe('1.23')
    expect(formatCurrency(1234.5678, '万元')).toBe('0.12')
  })

  // Test edge cases
  it('should handle edge cases', () => {
    expect(formatCurrency(0, '万元')).toBe('0')
    expect(formatCurrency(-1000, '千元')).toBe('-1')
    expect(formatCurrency(0.001, 0)).toBe('0')
  })
})

describe('isArrayAndNotEmpty', () => {
  it('should return true for non-empty arrays', () => {
    expect(isArrayAndNotEmpty([1, 2, 3])).toBe(true)
    expect(isArrayAndNotEmpty(['test'])).toBe(true)
    expect(isArrayAndNotEmpty([{}])).toBe(true)
  })

  it('should return false for empty arrays', () => {
    expect(isArrayAndNotEmpty([])).toBe(false)
  })

  it('should return false for non-array values', () => {
    expect(isArrayAndNotEmpty(null)).toBe(false)
    expect(isArrayAndNotEmpty(undefined)).toBe(false)
    expect(isArrayAndNotEmpty({})).toBe(false)
    expect(isArrayAndNotEmpty('test')).toBe(false)
    expect(isArrayAndNotEmpty(123)).toBe(false)
    expect(isArrayAndNotEmpty(true)).toBe(false)
  })
})

describe('isObjectAndNotEmpty', () => {
  it('should return true for non-empty objects', () => {
    expect(isObjectAndNotEmpty({ key: 'value' })).toBe(true)
    expect(isObjectAndNotEmpty({ a: 1, b: 2 })).toBe(true)
  })

  it('should return false for empty objects', () => {
    expect(isObjectAndNotEmpty({})).toBe(false)
  })

  it('should return false for arrays', () => {
    expect(isObjectAndNotEmpty([])).toBe(false)
    expect(isObjectAndNotEmpty([1, 2, 3])).toBe(false)
  })

  it('should return false for non-object values', () => {
    expect(isObjectAndNotEmpty(null)).toBe(false)
    expect(isObjectAndNotEmpty(undefined)).toBe(false)
    expect(isObjectAndNotEmpty('test')).toBe(false)
    expect(isObjectAndNotEmpty(123)).toBe(false)
    expect(isObjectAndNotEmpty(true)).toBe(false)
  })
})
