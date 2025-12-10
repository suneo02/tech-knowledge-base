import {
  requestToWFCSecureWithAxios,
  requestToWFCWithAxios,
  type ApiOptions,
  type ApiPaths,
  type GetApiData,
  type GetApiResponse,
  type WFC_API_PATH,
  type WindSecureApiParams,
  type WindSecureApiPayload,
} from 'gel-api'
import { axiosInstance } from './axios'
import type { AxiosRequestConfig } from 'axios'
/**
 * request to wfc
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options
 */
export function requestToWFC<P extends keyof ApiPaths[typeof WFC_API_PATH]>(
  api: P,
  data?: GetApiData<typeof WFC_API_PATH, P>,
  options: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'> = {}
): Promise<GetApiResponse<typeof WFC_API_PATH, P>> {
  return requestToWFCWithAxios(axiosInstance, api, data, options)
}

/**
 * @deprecated
 * 这玩意很恶心，最好让后端改掉
 * request to wfc secure
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param params 请求参数
 * @param data
 * @param options
 */
export async function requestToWFCSecure(
  params?: WindSecureApiParams,
  data?: WindSecureApiPayload,
  options: AxiosRequestConfig = {}
) {
  return requestToWFCSecureWithAxios(axiosInstance, params, data, options)
}
