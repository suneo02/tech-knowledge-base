import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { WindSessionHeader } from 'gel-api'
// 创建 axios 实例
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config?.baseURL || 'xprod',
    headers: {
      'Content-Type': 'application/json',
      [WindSessionHeader]: 'b92651b5d0dd4e79aafa9c5e895ded1d',
    },
    ...config,
  })

  return instance
}

// 创建默认实例
export const axiosInstanceClient = createAxiosInstance()
