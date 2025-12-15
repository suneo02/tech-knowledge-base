export type ApiRequestPage = {
  pageNo: number
  pageSize: number
}

// 基础请求参数
export interface PaginationParams {
  pageSize?: number
  pageIndex?: number
}

// 查询参数
export interface CorpSearchQueryParams extends PaginationParams {
  queryText: string
}

// 排序参数
export interface CorpSearchSortParams {
  sort?: string | number
}
