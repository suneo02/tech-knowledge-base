import { ApiPaths } from '@/pathType'
import { ApiOptions, GetApiData, GetApiResponse } from '@/types/common'
import { WFC_API_PATH } from '@/wfc'
import { AxiosInstance } from 'axios'
import { requestAutoWithAxios } from './base'

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
export function requestToWFCWithAxios<P extends keyof ApiPaths[typeof WFC_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P,
  data?: GetApiData<typeof WFC_API_PATH, P>,
  options: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'> = {}
): Promise<GetApiResponse<typeof WFC_API_PATH, P>> {
  return requestAutoWithAxios<typeof WFC_API_PATH, P>(axiosInstance, api, {
    server: WFC_API_PATH,
    data,
    ...options,
  })
}

/**
 * 创建WFC API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createWFCRequestWithAxios<P extends keyof ApiPaths[typeof WFC_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P
) {
  return async (
    data?: GetApiData<typeof WFC_API_PATH, P>,
    options?: Omit<ApiOptions<typeof WFC_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof WFC_API_PATH, P>> => {
    return requestToWFCWithAxios(axiosInstance, api, data, options)
  }
}
