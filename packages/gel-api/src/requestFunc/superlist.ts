import { ApiPaths } from '@/pathType'
import { SUPERLIST_API_PATH } from '@/superlist'
import { ApiOptions, GetApiData, GetApiResponse } from '@/types/common'
import { AxiosInstance } from 'axios'
import { requestAutoWithAxios } from './base'

/**
 * request to ent chat superlist
 *
 * 专门用于Wind企业聊天服务的请求函数
 * 自动设置server为WindEntChatPath，简化API调用
 *
 * @param api Wind企业聊天API路径
 * @param data
 * @param options 其他选项(method, appendUrl等)
 * @returns 响应数据的Promise
 *
 */
export function requestToSuperlistWithAxios<P extends keyof ApiPaths[typeof SUPERLIST_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P,
  data?: GetApiData<typeof SUPERLIST_API_PATH, P>,
  options: Omit<ApiOptions<typeof SUPERLIST_API_PATH, P>, 'server'> = {}
) {
  return requestAutoWithAxios<typeof SUPERLIST_API_PATH, P>(axiosInstance, api, {
    server: SUPERLIST_API_PATH,
    data,
    ...options,
  })
}

/**
 * 创建Superlist API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createSuperlistRequestWithAxios<P extends keyof ApiPaths[typeof SUPERLIST_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P
) {
  return async (
    data?: GetApiData<typeof SUPERLIST_API_PATH, P>,
    options?: Omit<ApiOptions<typeof SUPERLIST_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof SUPERLIST_API_PATH, P>> => {
    return requestToSuperlistWithAxios(axiosInstance, api, data, options)
  }
}
