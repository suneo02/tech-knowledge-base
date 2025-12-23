export interface SplTableHeader {
  columnId: number
  fieldType: string
  relation: string
  title: string
  isShow: boolean
}

export interface SplTable {
  headers: SplTableHeader[]
  total: number
  rows: string[][] // 有可能是JSON.stringify的数组
  title: string
  tableIndex: number
}
