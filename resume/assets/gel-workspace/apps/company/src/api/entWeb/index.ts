import {
  ApiOptions,
  ApiPaths,
  createEntWebAxiosInstance,
  GetApiData,
  GetApiResponse,
  requestToEntWebWithAxios,
  WIND_ENT_WEB_PATH,
} from 'gel-api'
import { requestErrorInterceptor, requestInterceptor } from '../interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from '../interceptors/response'

/**
 * 创建默认EntWeb实例
 */
export const entWebAxiosInstance = createEntWebAxiosInstance(undefined, {
  requestInterceptor: requestInterceptor,
  responseInterceptor: responseInterceptor,
  requestErrorInterceptor: requestErrorInterceptor,
  responseErrorInterceptor: responseErrorInterceptor,
})

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
export async function requestToEntWeb<P extends keyof ApiPaths[typeof WIND_ENT_WEB_PATH]>(
  cmd: P,
  data?: GetApiData<typeof WIND_ENT_WEB_PATH, P>,
  options: Omit<ApiOptions<typeof WIND_ENT_WEB_PATH, P>, 'server'> = {}
): Promise<GetApiResponse<typeof WIND_ENT_WEB_PATH, P>> {
  // 使用类型断言来解决 axios 版本不匹配的问题
  return requestToEntWebWithAxios(entWebAxiosInstance as any, cmd, data, options)
}
