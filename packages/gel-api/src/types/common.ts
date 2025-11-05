import { AxiosRequestConfig } from 'axios'
import { ApiPaths } from '../pathType'

/**
 * HTTP 请求方法枚举
 * 支持 GET、POST、PUT、DELETE、PATCH 五种标准 HTTP 方法
 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * HTTP 请求方法的小写形式
 * 通过 TypeScript 的 Lowercase 工具类型将 RequestMethod 转换为小写
 */
export type LowercaseRequestMethod = Lowercase<RequestMethod>

/**
 * 基础 API 类型定义
 */
// 从 ApiPaths 中获取所有可用的服务器类型
export type APIServer = keyof ApiPaths
// 获取指定服务器下的所有可用 API 路径
export type PathsForServer<S extends APIServer> = keyof ApiPaths[S]

/**
 * 通用字段提取工具类型
 * @template S - 服务器类型
 * @template P - API 路径类型
 * @template Field - 需要提取的字段名称
 *
 * 用于从 API 定义中提取特定字段（params、data、response）的类型
 * 如果字段不存在则返回 void，如果路径不存在则返回 never
 */
type ExtractApiField<
  S extends APIServer,
  P extends PathsForServer<S>,
  Field extends string,
> = P extends keyof ApiPaths[S] ? (Field extends keyof ApiPaths[S][P] ? ApiPaths[S][P][Field] : void) : never

/**
 * API 类型获取器
 * 基于 ExtractApiField 工具类型，简化常用 API 字段的类型获取
 */
// 获取 API 参数类型
export type GetApiParams<S extends APIServer, P extends PathsForServer<S>> = ExtractApiField<S, P, 'params'>
// 获取 API 请求数据类型
export type GetApiData<S extends APIServer, P extends PathsForServer<S>> = ExtractApiField<S, P, 'data'>
// 获取 API 响应数据类型
export type GetApiResponse<S extends APIServer, P extends PathsForServer<S>> = ExtractApiField<S, P, 'response'>

/**
 * API 请求选项类型
 * @template S - 服务器类型
 * @template P - API 路径类型
 * @template D - 请求数据类型，默认为对应 API 的 data 类型
 *
 * 继承 AxiosRequestConfig 配置，并添加自定义字段：
 * - server: 服务器标识
 * - params: 请求参数
 * - data: 请求数据
 * - appendUrl: 追加到 URL 的额外路径
 */
export type ApiOptions<S extends APIServer, P extends PathsForServer<S>, D = GetApiData<S, P>> = Omit<
  AxiosRequestConfig<D>,
  'data' | 'params'
> & {
  server: S
  params?: GetApiParams<S, P>
  data?: GetApiData<S, P>
  appendUrl?: string
}
