import { getApiPrefix } from '@/utils/env'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_TIMEOUT, CONTENT_TYPES } from './config'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'

// 创建 axios 实例
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiPrefix(),
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
    },
    ...config,
  })

  // 注册拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  // instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
  return instance
}

// 创建默认实例
export const axiosInstance = createAxiosInstance()
