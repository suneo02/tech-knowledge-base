import type { HeaderItem, RowItem } from '../types'

export const parseCellValue = (val: unknown): unknown => {
  if (val == null) return '--'
  if (typeof val === 'string') {
    const str = val
    if ((str.includes('Label') || str.includes('answer')) && str.startsWith('{')) {
      try {
        const parsed = JSON.parse(str)
        return parsed.Label ?? parsed.answer ?? '--'
      } catch {
        return str || '--'
      }
    }
    return str
  }
  return val
}

export const buildDataSource = (headers: HeaderItem[], rows: RowItem[]): Record<string, unknown>[] => {
  return rows.map((row) => {
    const item: Record<string, unknown> = {}
    headers.forEach((header, index) => {
      if (!header.isShow) {
        return // skip hidden columns to avoid misalignment
      }

      const dataIndex = String(header.columnId)
      const val = row[index]
      item[dataIndex] = parseCellValue(val)
    })
    return item
  })
}
