import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

/**
 * 创建用于EntWeb的axios实例
 * @param config 自定义配置，包括可选的拦截器
 * @returns AxiosInstance
 */
export const createEntWebAxiosInstance = (
  config?: AxiosRequestConfig,
  interceptors?: {
    requestInterceptor?: Parameters<AxiosInstance['interceptors']['request']['use']>[0]
    requestErrorInterceptor?: Parameters<AxiosInstance['interceptors']['request']['use']>[1]
    responseInterceptor?: Parameters<AxiosInstance['interceptors']['response']['use']>[0]
    responseErrorInterceptor?: Parameters<AxiosInstance['interceptors']['response']['use']>[1]
  }
): AxiosInstance => {
  const instance = axios.create({
    timeout: 30000, // 默认30秒超时
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  // 如果提供了拦截器，则注册它们
  if (interceptors?.requestInterceptor || interceptors?.requestErrorInterceptor) {
    instance.interceptors.request.use(interceptors.requestInterceptor, interceptors.requestErrorInterceptor)
  }
  if (interceptors?.responseInterceptor || interceptors?.responseErrorInterceptor) {
    instance.interceptors.response.use(interceptors.responseInterceptor, interceptors.responseErrorInterceptor)
  }

  return instance
}
