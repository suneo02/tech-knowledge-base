export interface RowItem {
  name: string
  id: string
}

export interface IndustryRow {
  list: RowItem[]
  confidence?: number
}

export interface IndustryColumnRenderProps {
  key?: string
  name?: string
  list: IndustryRow[]
  total?: number
  id?: string
}

export interface IndustryColumn {
  title: string
  dataIndex: string
  cellOnClick?: (cellData: RowItem) => void
  onClick?: () => void
}

export interface BaseIndustryProps {
  column: IndustryColumn[]
}

export interface ColumnRenderProps extends IndustryColumnRenderProps {
  column: IndustryColumn
  id?: string
}
