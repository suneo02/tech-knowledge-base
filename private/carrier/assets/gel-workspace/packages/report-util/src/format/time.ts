import { DEFAULT_EMPTY_TEXT } from '@/table/cell/shared'

// Helper functions for formatting
const isNullOrUndefined = (value: any): boolean => value == null
const formatToStandardDate = (year: string, month: string, day: string): string => `${year}-${month}-${day}`

/**
 * Formats a time string to a standardized format
 * @param timeStr Time string or number to format
 * @returns Formatted time string or '--' for null/invalid values
 */
export const formatTime = (timeStr: string | number | undefined, emptyText = DEFAULT_EMPTY_TEXT) => {
  // Handle null, undefined, or empty values
  if (isNullOrUndefined(timeStr) || timeStr === '') return emptyText
  if (timeStr === 0 || timeStr === '0') return emptyText

  // Convert to string for processing
  const time = String(timeStr)

  // Format patterns and their handlers
  const patterns = [
    // Already formatted patterns - return as is
    { pattern: /^\d{4}$/, handler: (m: RegExpMatchArray) => m[0] }, // Year format: 2010
    {
      pattern: /(\d{4})-(\d{1}|\d{2})$/,
      handler: (m: RegExpMatchArray) => m[0],
    }, // Year-month format: 2010-05
    {
      pattern: /(\d{4})-(\d{1}|\d{2})-(\d{1}|\d{2})$/,
      handler: (m: RegExpMatchArray) => m[0],
    }, // Year-month-day format: 2010-05-15

    // Range format: 20100101~20101231
    {
      pattern: /(\d{4})(\d{2})(\d{2})([^\d]+)(\d{4})(\d{2})(\d{2})/,
      handler: (m: RegExpMatchArray) =>
        `${formatToStandardDate(m[1], m[2], m[3])}${m[4]}${formatToStandardDate(m[5], m[6], m[7])}`,
    },

    // Date formats that need standardization
    {
      pattern: /(\d{4})\/?(\d{2})\/?(\d{2})/,
      handler: (m: RegExpMatchArray) => formatToStandardDate(m[1], m[2], m[3]),
    },
    {
      pattern: /(\d{4})-(\d{2})-(\d{2})T00:00:00/,
      handler: (m: RegExpMatchArray) => formatToStandardDate(m[1], m[2], m[3]),
    },
    {
      pattern: /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/,
      handler: (m: RegExpMatchArray) => formatToStandardDate(m[1], m[2], m[3]),
    },

    // Six-digit format: 202002 -> 2020-02
    {
      pattern: /^[0-9]{6}$/,
      handler: () => {
        const year = time.substring(0, 4)
        const month = time.substring(4, 6)
        return `${year}-${month}`
      },
    },
  ]

  // Try each pattern in order
  for (const { pattern, handler } of patterns) {
    const match = time.match(pattern)
    if (match) {
      return handler(match)
    }
  }

  // No pattern matched, return original or '--' if falsy
  return time || emptyText
}

export const formatTimeIntl = (data: string, isEn: boolean) => {
  if (data) {
    const timeArr = formatTime(data).split('-')
    const yearStr = isEn ? '-' : '年'
    const monthStr = isEn ? '-' : '月'
    const dayStr = isEn ? '' : '日'
    return timeArr[0] + yearStr + timeArr[1] + monthStr + (timeArr[2] ? timeArr[2] + dayStr : '')
  } else {
    return '--'
  }
}
