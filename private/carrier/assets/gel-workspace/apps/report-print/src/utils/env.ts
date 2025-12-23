/**
 * Environment utilities and constants
 */

import { getUrlSearch } from 'report-util/url'

// Environment detection
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

// API configuration
export const API_PREFIX = process.env.API_PREFIX || ''
export const DEV_WSID = process.env.DEV_WSID || ''

/**
 * 判断是否在终端中使用
 * @returns
 */
export const usedInClient = () => {
  // @ts-expect-error
  if (window.external && window.external.ClientFunc) {
    return true
  }
  return false
}

/**
 * 获取生产环境下的 WSID
 * @returns WSID
 */
export const getWsidProd = () => {
  try {
    // 1. 优先从 query string 获取

    let wsid = getUrlSearch('wind.sessionid')
    if (wsid) {
      return wsid
    }

    // 2. 其次从 cookie 获取
    const cookies = document.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf('wind.sessionid=') === 0) {
        wsid = cookies[i].split('=')[1]
        break
      }
    }

    return wsid || ''
  } catch (e) {
    console.error(e)
    return ''
  }
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
  }
  return ''
}
