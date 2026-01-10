import { isDev, isStaging } from '@/utils/env'
import { loaclDevManager } from 'gel-ui'
let cachedApiPrefix: string | undefined

/**
 * 获取基础请求地址
 */
export const getApiPrefix = () => {
  if (cachedApiPrefix !== undefined) {
    return cachedApiPrefix
  }
  const apiPrefixDev = loaclDevManager.get('GEL_API_PREFIX_DEV')
  if ((isDev || isStaging) && apiPrefixDev) {
    cachedApiPrefix = apiPrefixDev
    return cachedApiPrefix
  }
  cachedApiPrefix = ''
  return cachedApiPrefix
}
