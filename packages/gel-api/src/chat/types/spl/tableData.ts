export interface SplTableHeader {
  columnId: number
  fieldType: string
  relation: string
  title: string
  isShow: boolean
  linkToIdColumn?: number // 1 是对应要跳转的
}

export interface SplTable {
  headers: SplTableHeader[]
  total: number
  rows: string[][] // 有可能是JSON.stringify的数组
  title: string
  tableIndex: number
}
