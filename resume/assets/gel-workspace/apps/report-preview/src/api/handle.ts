import { API_PREFIX, isDev } from '@/utils/env'

/**
 * 获取基础请求地址
 */
export const getBaseUrl = () => {
  return isDev ? API_PREFIX : ''
}
