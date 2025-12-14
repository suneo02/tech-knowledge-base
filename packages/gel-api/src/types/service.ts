import { WIND_ENT_CHAT_PATH } from '@/chat'
import { SUPERLIST_API_PATH } from '@/superlist'
import { WFC_API_PATH } from '@/wfc'
import { WindSecureApiParams, WindSecureApiPayload, WindSecureApiResponse } from '@/windSecure'
import { AxiosRequestConfig } from 'axios'
import { ApiOptions, APIServer, GetApiData, GetApiResponse, PathsForServer } from './common'

/**
 * 基础请求函数类型
 * 用于创建通用的 API 请求函数
 * @template S - 服务器类型
 * @template P - API 路径类型
 */
export type TRequestAuto<S extends APIServer, P extends PathsForServer<S>> = (
  api: P,
  options?: ApiOptions<S, P>
) => Promise<GetApiResponse<S, P>>

/**
 * 特定服务器的通用请求函数类型
 * 用于创建针对特定服务器的 API 请求函数
 * @template Server - 目标服务器类型
 * @template P - API 路径类型
 */
type TRequestToServer<Server extends APIServer, P extends PathsForServer<Server>> = (
  api: P,
  data?: GetApiData<Server, P>,
  options?: Omit<ApiOptions<Server, P>, 'server'>
) => Promise<GetApiResponse<Server, P>>

/**
 * 特定服务器的具体端点请求函数类型
 * 用于创建针对特定服务器特定端点的请求函数
 * 与 TRequestToServer 的区别是不需要传入 api 参数
 * @template Server - 目标服务器类型
 * @template P - API 路径类型
 */
type TRequestToServerSpecific<Server extends APIServer, P extends PathsForServer<Server>> = (
  data?: GetApiData<Server, P>,
  options?: Omit<ApiOptions<Server, P>, 'server'>
) => Promise<GetApiResponse<Server, P>>

/**
 * 具体服务器实现类型
 * 基于通用请求函数类型的具体实现
 */
// Wind 企业聊天服务请求函数类型
export type TRequestToChat<P extends PathsForServer<typeof WIND_ENT_CHAT_PATH>> = TRequestToServerSpecific<
  typeof WIND_ENT_CHAT_PATH,
  P
>

// Superlist 服务请求函数类型
export type TRequestToSuperlist<P extends PathsForServer<typeof SUPERLIST_API_PATH>> = TRequestToServer<
  typeof SUPERLIST_API_PATH,
  P
>

// Superlist 服务特定端点请求函数类型
export type TRequestToSuperlistSpacfic<P extends PathsForServer<typeof SUPERLIST_API_PATH>> = TRequestToServerSpecific<
  typeof SUPERLIST_API_PATH,
  P
>

// WFC 服务请求函数类型
export type TRequestToWFC<P extends PathsForServer<typeof WFC_API_PATH>> = TRequestToServer<typeof WFC_API_PATH, P>

// WFC 服务特定端点请求函数类型
export type TRequestToWFCSpacfic<P extends PathsForServer<typeof WFC_API_PATH>> = TRequestToServerSpecific<
  typeof WFC_API_PATH,
  P
>

/**
 * WFC 安全请求函数类型
 * 特殊的请求类型，不遵循通用模式
 * 用于处理需要特殊安全措施的 WFC 请求
 */
export type TRequestToWFCSecure = (
  params?: WindSecureApiParams,
  data?: WindSecureApiPayload,
  options?: AxiosRequestConfig
) => Promise<WindSecureApiResponse>
