import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const isDev = process.env.NODE_ENV === 'development'

export interface EntWebAxiosConfig extends AxiosRequestConfig {
  requestInterceptor?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  requestErrorInterceptor?: (error: any) => any
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  responseErrorInterceptor?: (error: any) => any
}

/**
 * 创建用于EntWeb的axios实例
 * @param config 自定义配置，包括可选的拦截器
 * @returns AxiosInstance
 */
export const createEntWebAxiosInstance = (config?: EntWebAxiosConfig): AxiosInstance => {
  const host = window.location.host
  const isClient = typeof window !== 'undefined'
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1

  // 根据环境构建baseURL
  const baseUrl = isClient
    ? `https://${isTestEnvironment ? 'test' : 'gel'}.wind.com.cn`
    : `https://${process.env.NODE_ENV === 'development' ? 'wx.wind.com.cn' : host}`

  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // 默认30秒超时
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  // 如果提供了拦截器，则注册它们
  if (config?.requestInterceptor || config?.requestErrorInterceptor) {
    instance.interceptors.request.use(config.requestInterceptor, config.requestErrorInterceptor)
  }
  if (config?.responseInterceptor || config?.responseErrorInterceptor) {
    instance.interceptors.response.use(config.responseInterceptor, config.responseErrorInterceptor)
  }

  return instance
}
