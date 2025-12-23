import { isDev, isStaging } from '@/utils/env'
import { loaclDevManager } from 'gel-ui'

/**
 * 获取基础请求地址
 */
export const getApiPrefix = () => {
  const apiPrefixDev = loaclDevManager.get('GEL_API_PREFIX_DEV')

  if ((isDev || isStaging) && apiPrefixDev) {
    return apiPrefixDev
  }
  return ''
}
