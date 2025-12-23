import { requestToWFCSecure } from '@/api'
import {
  ApiOptions,
  ApiPaths,
  ApiResponseForWFC,
  GetApiData,
  GetApiResponse,
  SUPERLIST_API_PATH,
  WFC_API_PATH,
  WIND_ENT_CHAT_PATH,
  WindSecureApiParams,
  WindSecureApiPayload,
  WindSecureApiResponse,
} from 'gel-api'
import { requestToChatFcs, requestToSuperlistFcs, requestToWFCSuperlistFcs } from './requestFcs'
import { requestToWFC } from '.'
import { AxiosRequestConfig } from 'axios'

/**
 * 创建API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createChatRequestFcs<P extends keyof ApiPaths[typeof WIND_ENT_CHAT_PATH]>(api: P) {
  return async (
    data?: GetApiData<typeof WIND_ENT_CHAT_PATH, P>,
    options?: Omit<ApiOptions<typeof WIND_ENT_CHAT_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof WIND_ENT_CHAT_PATH, P>> => {
    return requestToChatFcs(api, data, options)
  }
}

/**
 * 创建Superlist API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createSuperlistRequestFcs<P extends keyof ApiPaths[typeof SUPERLIST_API_PATH]>(api: P) {
  return async (
    data?: GetApiData<typeof SUPERLIST_API_PATH, P>,
    options?: Omit<ApiOptions<typeof SUPERLIST_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof SUPERLIST_API_PATH, P>> => {
    return requestToSuperlistFcs(api, data, options)
  }
}

/**
 * 创建Superlist API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createDownloadRequestFcs<P extends keyof ApiPaths[typeof WFC_API_PATH]>(api: P) {
  return async (
    data?: GetApiData<typeof WFC_API_PATH, P>,
    options?: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof WFC_API_PATH, P>> => {
    return requestToWFC(api, data, options)
  }
}

/**
 * 创建WFC Secure API请求工厂函数
 * @param params 请求参数
 * @param data 请求数据
 * @param options 请求选项
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createWFCSuperlistRequestFcs<P extends keyof ApiPaths[typeof WFC_API_PATH]>(api: P) {
  return async (
    data?: GetApiData<typeof WFC_API_PATH, P>,
    options?: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof WFC_API_PATH, P>> => {// @ts-expect-error ttt
    return requestToWFCSuperlistFcs(api, data, options)
  }
}
export function createWFCSecureRequestFcs(
  params?: WindSecureApiParams,
  data?: WindSecureApiPayload,
  options: AxiosRequestConfig = {}
) {
  return async (): Promise<ApiResponseForWFC<WindSecureApiResponse>> => {
    return await requestToWFCSecure(params, data, options)
  }
}
