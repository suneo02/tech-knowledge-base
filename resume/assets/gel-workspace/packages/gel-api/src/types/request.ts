export type ApiRequestPage = {
  pageNo: number
  pageSize: number
}

// 基础请求参数
export interface PaginationBaseParams {
  pageSize: number
  pageIndex: number
}

// 查询参数
export interface QueryParams extends PaginationBaseParams {
  queryText: string
}

// 排序参数
export interface SortParams {
  sort?: string | number
}
