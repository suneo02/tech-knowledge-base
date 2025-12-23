import { ApiPaths } from '@/pathType'
import { APIServer, ApiOptions, GetApiResponse, LowercaseRequestMethod } from '@/types/common'
import { AxiosInstance } from 'axios'
import { merge } from 'lodash-es'
import path from 'path-browserify'
import qs from 'qs'
import { ApiCfg } from '../apiConfig'

/**
 * 智能API请求函数
 * @returns 响应数据的Promise
 */
export async function requestAutoWithAxios<S extends APIServer, P extends keyof ApiPaths[S]>(
  axiosInstance: AxiosInstance,
  api: P,
  { server, data, appendUrl = '', ...options }: ApiOptions<S, P>
): Promise<GetApiResponse<S, P>> {
  // 合并 ApiCfg 中的配置
  const apiConfig = ApiCfg[server]?.[api] || {}
  const mergedOptions = merge({}, apiConfig, options)

  const method = mergedOptions.method || 'POST'
  const methodLower = method.toLowerCase() as LowercaseRequestMethod
  const url = path.join(server, String(api), appendUrl || '')

  // 根据请求方法选择不同的请求方式
  if (methodLower === 'get' || methodLower === 'delete') {
    // GET/DELETE方法不处理form data，参数直接放在URL中
    const res = await axiosInstance[methodLower]<GetApiResponse<S, P>>(url, mergedOptions)
    return res.data
  } else {
    // POST/PUT/PATCH等方法，可能需要处理form data
    let processedData = data

    // 检查Content-Type是否为application/x-www-form-urlencoded
    if (
      mergedOptions.headers &&
      mergedOptions.headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
      data
    ) {
      processedData = qs.stringify(data) as any
    }

    const res = await axiosInstance[methodLower]<GetApiResponse<S, P>>(url, processedData, mergedOptions)
    return res.data
  }
}
