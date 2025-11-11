import { WIND_ENT_WEB_PATH } from '@/entWeb'
import { ApiPaths } from '@/pathType'
import { ApiOptions, GetApiData, GetApiResponse, LowercaseRequestMethod } from '@/types'
import { AxiosInstance } from 'axios'

/**
 * 请求EntWeb服务的方法
 *
 * 用于与数据查询类业务无关的逻辑，需要请求wind.ent.web的服务，如埋点等接口
 *
 * @param cmd 具体接口，如 'user-log/add?api=buryCode'
 * @param data 请求数据，如 { userLogItems: [ {}, {} ] }
 * @param options 其他配置选项
 * @returns 响应数据的Promise
 */
export async function requestToEntWebWithAxios<P extends keyof ApiPaths[typeof WIND_ENT_WEB_PATH]>(
  axiosInstance: AxiosInstance,
  cmd: P,
  data?: GetApiData<typeof WIND_ENT_WEB_PATH, P>,
  options: Omit<ApiOptions<typeof WIND_ENT_WEB_PATH, P>, 'server'> = {}
): Promise<GetApiResponse<typeof WIND_ENT_WEB_PATH, P>> {
  const method = (options.method || 'post').toLowerCase() as LowercaseRequestMethod
  const url = `${WIND_ENT_WEB_PATH}${cmd}`

  // 根据请求方法选择不同的请求方式
  if (method === 'get' || method === 'delete') {
    // GET/DELETE 方法，参数放在 URL 中
    const res = await axiosInstance[method]<GetApiResponse<typeof WIND_ENT_WEB_PATH, P>>(url, {
      ...options,
      params: data,
    })
    return res.data
  } else {
    // POST/PUT/PATCH 等方法
    const res = await axiosInstance[method]<GetApiResponse<typeof WIND_ENT_WEB_PATH, P>>(url, data, options)
    return res.data
  }
}
