// 表格信息接口
export interface TableInfo {
  result: {
    tableName: string
    sheetInfos: Array<{
      sheetId: number
      sheetName: string
    }>
  }
}

// 表格数据接口
export interface TableData {
  records: Record<string, unknown>[]
}
