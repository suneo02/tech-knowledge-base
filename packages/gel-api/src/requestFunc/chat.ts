import { WIND_ENT_CHAT_PATH } from '@/chat'
import { ApiPaths } from '@/pathType'
import { ApiOptions, GetApiData, GetApiResponse } from '@/types/common'
import { AxiosInstance } from 'axios'
import { requestAutoWithAxios } from './base'

/**
 * request to ent chat
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
export function requestToChatWithAxios<P extends keyof ApiPaths[typeof WIND_ENT_CHAT_PATH]>(
  axiosInstance: AxiosInstance,
  api: P,
  data?: GetApiData<typeof WIND_ENT_CHAT_PATH, P>,
  options: Omit<ApiOptions<typeof WIND_ENT_CHAT_PATH, P>, 'server'> = {}
) {
  return requestAutoWithAxios<typeof WIND_ENT_CHAT_PATH, P>(axiosInstance, api, {
    server: WIND_ENT_CHAT_PATH,
    data,
    ...options,
  })
}

/**
 * 创建API请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createChatRequestWithAxios<P extends keyof ApiPaths[typeof WIND_ENT_CHAT_PATH]>(
  axiosInstance: AxiosInstance,
  api: P
) {
  return async (
    data?: GetApiData<typeof WIND_ENT_CHAT_PATH, P>,
    options?: Omit<ApiOptions<typeof WIND_ENT_CHAT_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof WIND_ENT_CHAT_PATH, P>> => {
    return requestToChatWithAxios(axiosInstance, api, data, options)
  }
}
