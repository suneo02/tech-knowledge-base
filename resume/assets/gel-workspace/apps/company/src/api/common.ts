import { ApiResponse } from '@/api/types.ts'
import { AxiosRequestConfig } from 'axios'
import axios from './index.ts'

// 通用请求函数
export const myWfcAjax = <R = null, T = undefined>(
  cmd: string,
  data?: T,
  params?: AxiosRequestConfig['params'],
  options?: AxiosRequestConfig & { formType?: 'payload' }
): Promise<ApiResponse<R>> => {
  return axios.request({
    method: 'post',
    cmd,
    data,
    params,
    ...options,
  })
}
