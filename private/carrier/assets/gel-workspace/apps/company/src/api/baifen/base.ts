import { getApiPrefix, getWsid, isDev, usedInClient } from '@/utils/env'
import { message } from '@wind/wind-ui'
import axios, { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_TIMEOUT, BaifenCompApiCode, BaifenCompApiResponse, CONTENT_TYPES, WindSessionHeader } from 'gel-api'
import { intl } from 'gel-util/intl'

// 请求拦截器
const requestInterceptor: Parameters<AxiosInstance['interceptors']['request']['use']>[0] = (config) => {
  // 动态获取 session ID
  const wsid = getWsid()
  if (wsid) {
    config.headers[WindSessionHeader] = wsid
  }

  return config
}

// 请求错误拦截器
const requestErrorInterceptor = (error: Error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
}

const responseInterceptor: Parameters<AxiosInterceptorManager<AxiosResponse<BaifenCompApiResponse>>['use']>[0] = (
  response
) => {
  switch (response.data?.resultCode) {
    case BaifenCompApiCode.DuplicateSubmit: {
      message.warning(intl('480875', '申请正在处理，请勿重复提交'))
    }
  }
  return response
}

const responseErrorInterceptor = (error: Error) => {
  console.error('Response error:', error)
  if (isDev) {
    message.error(error.message)
  }
  return Promise.reject(error)
}

// 创建 axios 实例
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiPrefix(),
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': CONTENT_TYPES.JSON,
      module: usedInClient() ? 'S.PC' : 'S312.WEB',
    },
    ...config,
  })

  // 注册拦截器
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
  return instance
}

// 创建默认实例
export const baifenAxiosInstance = createAxiosInstance()
