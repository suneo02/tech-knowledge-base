import { TableInfo } from '../types'

// 表格信息的mock数据
export const mockTableInfo: TableInfo = {
  result: {
    tableName: '测试表格', // @ts-expect-error
    sheetInfos: [{ sheetId: '1', sheetName: '测试表格' }],
  },
}

// 表格数据的mock数据
export const mockTableData = {
  records: [
    { '1': 'data1', '2': 'data1' },
    { '1': 'data2', '2': 'data2' },
  ],
}

// 表格列定义的mock数据
export const mockColumns = [
  { field: '1', title: '列1' },
  { field: '2', title: '列2' },
]
