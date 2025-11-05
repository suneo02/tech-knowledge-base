import type { IBasicColumnBodyDefine } from '@visactor/vtable/es/ts-types/list-table/define/basic-define'

// 表格基础信息
export interface ITableSheet {
  title: string
  id: string
}

export interface ITableInfo {
  tableId: string
  tableTitle: string
  sheet: ITableSheet[]
}

// 表格数据源类型
export interface ITableDataSource {
  [key: string]: string | number | ITableDataExtension
}

// 表格数据扩展信息
export interface ITableDataExtension {
  value: string | number
  from: 'enterprise' | 'indicator' | 'ai' // 数据来源：企业数据浏览器、指标、AI
  id: string // 数据来源ID
  [key: string]: string | number | boolean | object // 其他扩展字段，避免使用any
}

// 查询表格请求参数
export interface IQueryTableRequest {
  chatId: string
}

// 查询表格响应
export interface IQueryTableResponse {
  code: number
  message: string
  result: ITableInfo
}

// 创建空白表格请求参数
export interface ICreateEmptyTableRequest {
  chatId: string
}

// 创建表格请求参数
export interface ICreateTableRequest {
  chatId: string
  columns?: IBasicColumnBodyDefine[]
  data?: ITableDataSource[]
  sheetId?: number // 可选，如果有则在指定sheet中添加数据，否则创建新sheet
}

// 创建表格响应
export interface ICreateTableResponse {
  code: number
  message: string
  result: ITableInfo
}

// 修改表格名称请求参数
export interface IUpdateTableNameRequest {
  chatId: string
  tableId: string
  tableTitle: string
}

// 修改表格名称响应
export interface IUpdateTableNameResponse {
  code: number
  message: string
}

// Sheet相关接口
// 创建Sheet请求参数
export interface ICreateSheetRequest {
  chatId: string
  tableId: string
  title?: string // 可选的sheet标题
}

// 创建Sheet响应
export interface ICreateSheetResponse {
  code: number
  message: string
  result: {
    sheetId: number
  }
}

// 删除Sheet请求参数
export interface IDeleteSheetRequest {
  chatId: string
  tableId: string
  sheetId: number
}

// 删除Sheet响应
export interface IDeleteSheetResponse {
  code: number
  message: string
}

// 修改Sheet名称请求参数
export interface IUpdateSheetNameRequest {
  chatId: string
  tableId: string
  sheetId: number
  sheetTitle: string
}

// 修改Sheet名称响应
export interface IUpdateSheetNameResponse {
  code: number
  message: string
}

// 查询Sheet数据请求参数
export interface IQuerySheetDataRequest {
  chatId: string
  tableId: string
  sheetId: number
}

// 查询Sheet数据响应
export interface IQuerySheetDataResponse {
  code: number
  message: string
  result: {
    columns: IBasicColumnBodyDefine[]
    data: ITableDataSource[]
  }
}
