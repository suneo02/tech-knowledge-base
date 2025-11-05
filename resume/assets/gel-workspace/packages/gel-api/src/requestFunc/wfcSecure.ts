import { LowercaseRequestMethod } from '@/types/common'
import { ApiResponseForWFC } from '@/wfc'
import { WIND_SECURE_API_PATH, WindSecureApiParams, WindSecureApiPayload, WindSecureApiResponse } from '@/windSecure'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'

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
export async function requestToWFCSecureWithAxios(
  axiosInstance: AxiosInstance,
  params?: WindSecureApiParams,
  data?: WindSecureApiPayload,
  options: AxiosRequestConfig = {}
) {
  // 合并 ApiCfg 中的配置
  const method = options.method || 'POST'
  const methodLower = method.toLowerCase() as LowercaseRequestMethod
  const url = WIND_SECURE_API_PATH

  const contentType = options.headers?.['Content-Type'] || 'application/x-www-form-urlencoded'

  // 根据请求方法选择不同的请求方式
  if (methodLower === 'get' || methodLower === 'delete') {
    // GET/DELETE方法不处理form data，参数直接放在URL中
    const res = await axiosInstance[methodLower]<ApiResponseForWFC<WindSecureApiResponse>>(url, {
      ...options,
      params,
    })
    return res.data
  } else {
    // POST/PUT/PATCH等方法，可能需要处理form data
    let processedData = data

    // 检查Content-Type是否为application/x-www-form-urlencoded
    if (contentType === 'application/x-www-form-urlencoded' && data) {
      processedData = qs.stringify(data) as any
    }

    const res = await axiosInstance[methodLower]<ApiResponseForWFC<WindSecureApiResponse>>(url, processedData, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': contentType,
      },
      params,
    })
    return res.data
  }
}

/**
 * wfc secure 请求 工厂函数
 */
export function createWFCSecureRequestWithAxios(axiosInstance: AxiosInstance) {
  return async (params?: WindSecureApiParams, data?: WindSecureApiPayload, options: AxiosRequestConfig = {}) => {
    return requestToWFCSecureWithAxios(axiosInstance, params, data, options)
  }
}
