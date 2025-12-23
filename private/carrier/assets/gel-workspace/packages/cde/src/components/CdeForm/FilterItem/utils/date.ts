import dayjs from 'dayjs'

export type DateRangeValue = [dayjs.Dayjs | null, dayjs.Dayjs | null]

/**
 * Parses a date string like "20250602-20250606", "20250603-", or "-20250605"
 * into a Day.js date range tuple, preserving nulls for one-sided ranges.
 * @param dateStr The date string to parse.
 * @returns A tuple of Day.js objects, or null if the string is invalid or empty.
 */
export const parseDateString = (dateStr?: string): DateRangeValue | null => {
  if (!dateStr || !dateStr.includes('-')) {
    return null
  }

  const [start, end] = dateStr.split('-')
  const startDate = start ? dayjs(start, 'YYYYMMDD') : null
  const endDate = end ? dayjs(end, 'YYYYMMDD') : null

  // Only return a tuple if at least one date is valid
  if (startDate?.isValid() || endDate?.isValid()) {
    return [startDate, endDate]
  }

  return null
}

/**
 * Formats a Day.js date range tuple back into a string like "YYYYMMDD-YYYYMMDD".
 * Handles nulls for one-sided ranges.
 * @param dateRange The Day.js date range tuple.
 * @returns The formatted date string.
 */
export const formatDateRange = (dateRange?: DateRangeValue | null): string => {
  if (!dateRange || dateRange.length !== 2) {
    return ''
  }
  const [start, end] = dateRange
  const startStr = start ? start.format('YYYYMMDD') : ''
  const endStr = end ? end.format('YYYYMMDD') : ''

  if (!startStr && !endStr) return ''

  return `${startStr}-${endStr}`
}
