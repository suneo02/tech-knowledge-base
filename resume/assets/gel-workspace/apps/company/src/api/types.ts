import { ApiCodeForWfc, ApiResponseForWFC } from 'gel-api/*'
import { ApiPaths } from './paths'
export { ApiCodeForWfc } from 'gel-api'

// 基础响应类型
export interface ApiResponse<T = any> extends Pick<ApiResponseForWFC, 'status'> {
  Data: T
  ErrorCode: ApiCodeForWfc
  code: ApiCodeForWfc
  data?: T
  ErrorMessage: string
  Page: PageInfo | null
  State?: number
}

export interface IPagParam {
  pageNo?: number
  pageSize?: number
}

// 分页信息
export interface PageInfo {
  CurrentPage: number
  PageSize: number
  Records: number
  TotalPage: number
}

// API路径字符串类型
export type ApiPath = keyof ApiPaths

// 获取API参数类型
export type GetApiParams<T extends ApiPath> = ApiPaths[T]['params']

// 获取API响应类型
export type GetApiResponse<T extends ApiPath> = ApiPaths[T]['response']

// API请求选项
export interface ApiOptions<T extends ApiPath> {
  params?: GetApiParams<T>
  noExtra?: boolean
  noHashParams?: boolean // 请求体不使用hash参数
  matchOldData?: boolean
  id?: string // 附着在 url 最后一位
  serverUrl?: string
  formType?: 'payload'
}

/**
 * 流式API请求选项
 * 扩展自API请求选项，添加流式数据处理回调
 */
export interface StreamApiOptions<T extends ApiPath> extends Omit<ApiOptions<T>, 'formType'> {
  params?: GetApiParams<T>
  formType?: 'payload'
  onStreamData?: (chunk: string) => void // 处理流式数据块的回调
  onError?: (error: any) => void // 错误处理回调
  onComplete?: () => void // 流结束回调
}
