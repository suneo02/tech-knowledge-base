import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { API_TIMEOUT, CONTENT_TYPES } from 'gel-api'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from './interceptors/response'
import { getApiPrefix } from './baseUrl'

// 创建 axios 实例
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config?.baseURL || getApiPrefix(),
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

// 创建默认实例
export const axiosInstance = createAxiosInstance()

// 导出请求方法
export const requestRaw = {
  get: <T = Record<string, unknown>>(url: string, config?: AxiosRequestConfig) => axiosInstance.get<T>(url, config),

  post: <T = Record<string, unknown>>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = Record<string, unknown>>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  delete: <T = Record<string, unknown>>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),

  patch: <T = Record<string, unknown>>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),
}
