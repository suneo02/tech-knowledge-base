import { WindSessionHeader } from '.'
import { getUrlSearchValue } from '../link/handle/param'

export const WSIDStorageKey = 'GEL-wsid'
// 是否终端内使用
export const usedInClient = () => {
  if (window.external && window.external.ClientFunc) {
    return true
  }
  return false
}

/**
 * 是否来自 F9
 * @returns {boolean}
 */
export const isFromF9 = () => {
  return getUrlSearchValue('fromPage')?.toLocaleLowerCase() === 'f9'
}

/**
 * 这个应该移动到 ai chat 中，因为开发环境下的 WSID 是根据当前环境从配置中获取的
 * 获取开发环境下的 WSID
 * @returns WSID
 */
export const getDevSessionId = () => {
  try {
    const env = JSON.parse(localStorage.getItem('env') || '{}')
    return env?.sessionId || localStorage.getItem(WSIDStorageKey)
  } catch (e) {
    console.error('getDevSessionId error', e)
    return ''
  }
}

/**
 * 获取 终端 session ID
 * 按优先级依次从以下来源获取：
 *
 * 生产环境优先级：
 * 1. 本地存储 - 如果已经存储过，优先使用
 * 2. 全局变量 - 从 window.global_wsid 获取
 * 3. URL 参数 - 从 URL 的 wind.sessionid 参数获取
 * 4. 运行时配置 - 根据当前环境从配置中获取
 *
 * 开发环境优先级：
 * 1. 全局变量 - 从 window.global_wsid 获取
 * 2. URL 参数 - 从 URL 的 wind.sessionid 参数获取
 * 3. 运行时配置 - 根据当前环境从配置中获取
 *
 * @returns {string} session ID
 */
export const getWSID = (isDev: boolean): string => {
  let wsidProd = getWsidProd()
  let wsidDev = getDevSessionId()
  if (wsidProd) {
    return wsidProd
  }
  if (wsidDev && !isDev) {
    return wsidDev
  }
  return ''
}

// 是否时独立web测试站
export const isWebTest = () => {
  const loc = window.location.href?.toLocaleLowerCase() || ''
  return loc.indexOf('/wind.ent.web/gel') > -1
}

/**
 * 获取生产环境下的 WSID
 * @returns WSID
 */
export const getWsidProd = () => {
  try {
    // 1. 优先从 query string 获取
    let wsid = getUrlSearchValue(WindSessionHeader) as string | undefined

    // 2. 其次从 cookie 获取
    if (!wsid) {
      wsid = document.cookie
        .split('; ')
        .find((row) => row.startsWith('wind.sessionid='))
        ?.split('=')[1]
    }

    // 3. 其次从 sessionStorage 获取
    if (!wsid) {
      wsid = JSON.parse(sessionStorage.getItem(WSIDStorageKey) || '') || ''
    }

    // 4. 再其次从 window.global_wsid 获取
    if (!wsid) {
      wsid = window.global_wsid
    }

    return wsid || ''
  } catch (e) {
    console.error('getWsidProd error', e)
    return ''
  }
}
