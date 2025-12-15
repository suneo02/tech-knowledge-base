import { AxiosError } from 'axios'

// 错误日志记录函数类型
type ErrorLoggerFunction = (error: Error | AxiosError) => void

// 默认的错误日志记录器
let errorLogger: ErrorLoggerFunction = (error) => {
  console.error('api error', error)
}

// 设置错误日志记录器
export const setErrorLogger = (logger: ErrorLoggerFunction) => {
  errorLogger = logger
}

// 自定义API错误类
export class ApiError extends Error {
  public code: number
  public status?: number
  public path?: string

  constructor(message: string, code: number, status?: number, path?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.path = path
  }
}

// 处理 Axios 错误
export const handleAxiosError = (error: AxiosError): ApiError => {
  // 记录错误

  if (error.response) {
    const { status } = error.response
    // 服务器响应错误
    if (status !== 404) {
      errorLogger(error)
    }
    return new ApiError('Server Error', status, status, error.config?.url)
  } else if (error.request) {
    // 请求发送失败
    return new ApiError('Network Error - No response received', 0)
  } else {
    // 请求配置错误
    return new ApiError(error.message || 'Request Configuration Error', 0)
  }
}

// 错误消息格式化
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return `[${error.code}] ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// 统一错误处理
export const errorHandler = (error: unknown) => {
  const errorMessage = formatErrorMessage(error)

  // 这里可以集成你的消息通知系统，比如 Ant Design 的 message
  console.error(errorMessage)

  // 可以根据不同的错误码进行不同的处理
  if (error instanceof ApiError) {
    // console.log('🚀 ~ errorHandler ~ error:', error)
    switch (error.code) {
      case 401:
        // 处理未授权
        break
      case 403:
        // 处理禁止访问
        break
      case 404:
        // 处理资源未找到
        break
      case 500:
        // 处理服务器错误
        break
      default:
        // 处理其他错误
        break
    }
  }

  return Promise.reject(error)
}
