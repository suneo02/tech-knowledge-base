export interface TableOptionsCommon {
  bordered?: boolean
  size?: 'default' | 'middle' | 'small'
  loading?: boolean
  rowKey?: string
  rowClassName?: string
  scroll?: { x?: number; y?: number } | null
  showHeader?: boolean
  className?: string
  labelWidth?: string | number
  gutter?: number
  noDataText?: string
}
