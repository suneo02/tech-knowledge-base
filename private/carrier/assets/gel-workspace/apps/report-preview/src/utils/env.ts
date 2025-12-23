/**
 * Environment utilities and constants
 */

import { loaclDevManager } from 'gel-ui'
import { getWsidProd } from 'gel-util/env'

// Environment detection
export const MODE = import.meta.env.MODE
export const isDev = MODE === 'development'
export const isProd = MODE === 'production'
export const isStaging = MODE === 'staging'
// API configuration
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || ''
export const DEV_WSID = import.meta.env.VITE_DEV_WSID || ''

export const getApiPrefix = () => {
  let apiDevPrefix = loaclDevManager.get('GEL_API_PREFIX_DEV')
  if ((isDev || isStaging) && apiDevPrefix) {
    return apiDevPrefix
  }
  return API_PREFIX
}

/**
 * 此方法目前只用来在跳转一些 外部的 web 地址，或者处理图片 url 时使用，其余时非常不推荐使用
 * @returns
 */
export const getWsid = () => {
  let wsid = getWsidProd()
  if (wsid) {
    return wsid
  }
  if (isDev) {
    return DEV_WSID
  } else {
    return ''
  }
}
