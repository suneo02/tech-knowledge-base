import { getApiPrefix } from '@/utils'
import axios, { AxiosInstance } from 'axios'
import { API_TIMEOUT } from 'report-util/constants'
import { requestErrorInterceptor, requestInterceptor } from './interceptors/request'
import { responseErrorInterceptor, responseInterceptor } from './interceptors/response'

// 创建 axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiPrefix(),
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 注册拦截器3
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
  return instance
}

// 创建默认实例
export const axiosInstance = createAxiosInstance()
