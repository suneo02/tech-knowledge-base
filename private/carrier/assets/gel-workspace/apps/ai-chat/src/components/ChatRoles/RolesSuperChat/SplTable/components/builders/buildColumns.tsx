import type { ColumnProps } from '@wind/wind-ui-table'
import type { HeaderItem, RowItem, BuildColumnsOptions } from '../types'
import { DEFAULT_COLUMN_WIDTH } from '../constants'
import { buildLinkRenderer } from './buildLinkRenderer'

export const buildColumns = (
  headers: HeaderItem[],
  rows: RowItem[],
  options?: BuildColumnsOptions
): ColumnProps<Record<string, unknown>>[] => {
  const { enableLinking = true, defaultWidth = DEFAULT_COLUMN_WIDTH, widthMap } = options || {}
  const visibleHeaders = headers.filter((h) => h.isShow !== false)

  return visibleHeaders.map((header) => ({
    title: header.title,
    dataIndex: header.columnId.toString(),
    width: widthMap?.[String(header.columnId)] ?? defaultWidth,
    ellipsis: true,
    render: enableLinking ? buildLinkRenderer(header, headers, rows) : undefined,
  }))
}
