import { getApiPrefix } from '@/services/request'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_TIMEOUT, CONTENT_TYPES } from 'gel-api'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from './interceptors/response'

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
  get: <T = any>(url: string, config?: AxiosRequestConfig) => axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => axiosInstance.delete<T>(url, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.patch<T>(url, data, config),
}
