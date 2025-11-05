import { message } from '@wind/wind-ui'
import { AxiosError, AxiosResponse } from 'axios'
import { ApiResponseForChat, ApiResponseForIndicator, ApiResponseForWFC } from 'gel-api'
// Type guard functions

export const responseInterceptor = (
  response: AxiosResponse<ApiResponseForChat<any> | ApiResponseForWFC<any> | ApiResponseForIndicator<any>>
) => {
  // 处理普通请求
  const { data } = response

  if ('ErrorCode' in data) {
    // 统一转换为字符串，后端也不能保证返回类型
    data.ErrorCode = String(data.ErrorCode)
  }

  return response
}

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 403) {
    message.error(error.message)
  }
  return Promise.reject(error)
}
