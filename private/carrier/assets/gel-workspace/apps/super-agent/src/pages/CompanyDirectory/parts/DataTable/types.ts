import type { Column } from 'gel-api'

export interface BasicRecord {
  [key: string]: unknown
}

export interface BasicColumn extends Omit<Column, 'title'> {
  title?: React.ReactNode
  dataIndex?: string
  ellipsis?: boolean
  render?: (value: unknown, record: BasicRecord, index?: number) => React.ReactNode
  disableExpand?: boolean
  width?: number
  type?: string | import('gel-api').ColumnDataTypeEnum
  [key: string]: unknown
}
