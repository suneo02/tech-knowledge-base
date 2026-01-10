export type HeaderItem = {
  title: string
  columnId: string | number
  isShow?: boolean
  linkToIdColumn?: string | number | boolean
}

export type RowItem = unknown[]

export type BuildColumnsOptions = {
  enableLinking?: boolean
  defaultWidth?: number
  widthMap?: Record<string, number>
}

export type TableConfig = {
  pagination?: {
    pageSize?: number
    current?: number
  }
  scroll?: {
    x?: number | string
    y?: number | string
  }
  striped?: boolean
}

export type SplTableProps = {
  headers: HeaderItem[]
  rows: RowItem[]
  config?: TableConfig
}
