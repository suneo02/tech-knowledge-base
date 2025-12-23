import { getUrlSearchValue } from '../common/url'
import { WindSessionHeader } from './config'

declare global {
  interface Window {
    global_wsid?: string
  }
}

export const WSIDStorageKey = 'GEL-wsid'
// 是否终端内使用
export const usedInClient = () => {
  return !!(window.external && window.external.ClientFunc)
}

/**
 * 是否来自 F9企业库资料页面
 * @returns {boolean}
 */
export const isFromF9 = () => {
  return getUrlSearchValue('fromPage')?.toLocaleLowerCase() === 'f9'
}

/**
 * 是否来自 F9单独模块访问（走f9的fuse和权限控制逻辑，如股权穿透图）
 * @returns {boolean}
 */
export const isLinkSourceF9 = () => {
  return getUrlSearchValue('linksource')?.toLocaleLowerCase() === 'f9'
}

/**
 * 判断是否是终端的应用路径，包括在终端及 web 环境都会生效
 */
export const isTerminalApp = () => {
  try {
    return /pc\.front/i.test(window.location.href?.toLocaleLowerCase())
  } catch (e) {
    console.error('isTerminalApp error', e)
    return false
  }
}

// 是否时独立web测试站
export const isWebTest = () => {
  try {
    const host = window.location.host?.toLocaleLowerCase() || ''
    // 判断host含有test.wind且不在客户端中使用
    return (host.indexOf('test.wind') > -1 || host.indexOf('8.173') > -1) && !usedInClient()
  } catch (e) {
    return false
  }
}

/**
 * 获取是否是测试站
 */
export const isTerminalTestSite = () => {
  return window.location.host.indexOf('8.173') > -1 || window.location.host.indexOf('test.wind.') > -1
}

/**
 * 获取生产环境下的 WSID
 * @returns WSID
 */
export const getWsidProd = () => {
  try {
    // 1. 优先从 query string 获取
    let wsid = getUrlSearchValue(WindSessionHeader)

    // 2. 其次从 localStorage 获取 - web端登录后存在localStorage
    if (!wsid) {
      wsid = localStorage.getItem(WindSessionHeader) || ''
    }

    // 3. 其次从 cookie 获取 - 兼容旧用户未登录情况下还能从cookie中获取，2025.8月后可删除
    if (!wsid) {
      wsid = document.cookie
        .split('; ')
        .find((row) => row.startsWith('wind.sessionid='))
        ?.split('=')[1]
    }

    // 4. 其次从 sessionStorage 获取 - 终端登录后存在sessionStorage
    if (!wsid) {
      const wsidRaw = sessionStorage.getItem(WSIDStorageKey)
      if (wsidRaw) {
        try {
          wsid = JSON.parse(wsidRaw) || ''
        } catch (error) {
          console.error('getWsidProd from sessionStorage parse error', error)
        }
      }
    }

    // 5. 再其次从 window.global_wsid 获取 - 老逻辑
    if (!wsid) {
      wsid = window.global_wsid
    }

    return wsid || ''
  } catch (e) {
    console.error('getWsidProd error', e)
    return ''
  }
}
