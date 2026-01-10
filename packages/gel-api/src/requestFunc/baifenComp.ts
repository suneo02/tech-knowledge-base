import { BAIFEN_COMP_API_PATH } from '@/baifen'
import { ApiPaths } from '@/pathType'
import { ApiOptions, GetApiData, GetApiResponse } from '@/types/common'
import { AxiosInstance } from 'axios'
import { requestAutoWithAxios } from './base'

/**
 * request to baifen comp
 *
 * 专门用于百分联系客户经理服务的请求函数
 * 自动设置server为BaifenCompPath，简化API调用
 *
 * @param api 百分联系客户经理API路径
 * @param data
 * @param options
 */
export function requestToBaifenCompWithAxios<P extends keyof ApiPaths[typeof BAIFEN_COMP_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P,
  data?: GetApiData<typeof BAIFEN_COMP_API_PATH, P>,
  options: Omit<ApiOptions<typeof BAIFEN_COMP_API_PATH, P>, 'server'> = {}
): Promise<GetApiResponse<typeof BAIFEN_COMP_API_PATH, P>> {
  return requestAutoWithAxios<typeof BAIFEN_COMP_API_PATH, P>(axiosInstance, api, {
    server: BAIFEN_COMP_API_PATH,
    data,
    ...options,
  })
}

/**
 * 创建百分联系客户经理 API 请求工厂函数
 * @param api API路径
 * @returns 返回一个包装过的请求函数，便于在hooks中使用
 */
export function createBaifenCompRequestWithAxios<P extends keyof ApiPaths[typeof BAIFEN_COMP_API_PATH]>(
  axiosInstance: AxiosInstance,
  api: P
) {
  return async (
    data?: GetApiData<typeof BAIFEN_COMP_API_PATH, P>,
    options?: Omit<ApiOptions<typeof BAIFEN_COMP_API_PATH, P>, 'server'>
  ): Promise<GetApiResponse<typeof BAIFEN_COMP_API_PATH, P>> => {
    return requestToBaifenCompWithAxios(axiosInstance, api, data, options)
  }
}
