import { isDev } from '@/utils/env'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiOptions, ApiPaths, GetApiData, GetApiResponse, requestToEntWebWithAxios, WIND_ENT_WEB_PATH } from 'gel-api'
import { usedInClient } from 'gel-util/env'
import { API_TIMEOUT, CONTENT_TYPES } from '../config'
import { setErrorLogger } from '../error/error-handling'
import { requestErrorInterceptor, requestInterceptor } from '../interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from '../interceptors/response'

/**
 * 创建用于EntWeb的axios实例
 * @param config 自定义配置
 * @returns AxiosInstance
 */
const createEntWebAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const host = window.location.host
  const isClient = usedInClient()
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1

  // 根据环境构建baseURL
  const baseUrl = isClient
    ? `https://${isTestEnvironment ? 'test' : 'gel'}.wind.com.cn`
    : `https://${isDev ? 'wx.wind.com.cn' : host}`

  const instance = axios.create({
    baseURL: baseUrl,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
    },
    ...config,
  })

  // 注册拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

  return instance
}

/**
 * 创建默认EntWeb实例
 */
export const entWebAxiosInstance = createEntWebAxiosInstance()

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
setErrorLogger((error) => {
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
