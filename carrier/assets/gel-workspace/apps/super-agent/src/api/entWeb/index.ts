import { isDev } from '@/utils/env'
import type { ApiOptions, ApiPaths, GetApiData, GetApiResponse } from 'gel-api'
import { createEntWebAxiosInstance, requestToEntWebWithAxios, WIND_ENT_WEB_PATH } from 'gel-api'
import { setErrorLogger } from '../error/error-handling'
import { requestErrorInterceptor, requestInterceptor } from '../interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from '../interceptors/response'
import type { AxiosError } from 'axios'

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
  return requestToEntWebWithAxios(entWebAxiosInstance, cmd, data, options)
}

// 设置错误记录器
setErrorLogger((error: Error | AxiosError) => {
  setTimeout(() => {
    if (isDev) {
      return
    }
    requestToEntWeb('openapi/eaglesLog', {
      reason: `[ai-chat] ${JSON.stringify(error)}`,
      name: 'WFT PC',
    })
  }, 300)
})
