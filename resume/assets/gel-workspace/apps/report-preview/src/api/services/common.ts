import { AxiosRequestConfig } from 'axios'
import {
  ApiOptions,
  ApiPaths,
  APIServer,
  GetApiData,
  GetApiResponse,
  requestAutoWithAxios,
  requestToWFCSecureWithAxios,
  requestToWFCWithAxios,
  WFC_API_PATH,
  WindSecureApiParams,
  WindSecureApiPayload,
} from 'gel-api'
import { axiosInstance } from '../axios'

/**
 * 智能API请求函数
 * @returns 响应数据的Promise
 */
export async function requestAuto<S extends APIServer, P extends keyof ApiPaths[S]>(
  api: P,
  { server, data, appendUrl = '', ...options }: ApiOptions<S, P>
): Promise<GetApiResponse<S, P>> {
  return requestAutoWithAxios<S, P>(axiosInstance, api, {
    server,
    data,
    appendUrl,
    ...options,
  })
}

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
