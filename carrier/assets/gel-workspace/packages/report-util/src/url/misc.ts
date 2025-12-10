export const getUrlSearch = function (param: string, addr?: string, options?: { ignoreCase?: boolean }): string {
  try {
    // 获取 url 某个字段后的字符串，支持 hash 后的查询参数
    let loc = addr || (typeof window !== 'undefined' ? window.location.href : '')
    if (!loc) return ''

    const ignoreCase = options && typeof options.ignoreCase !== 'undefined' ? options.ignoreCase : true
    const key = param

    // 解析 search 部分
    let value: string | undefined
    const getParam = (search: string) => {
      if (!search) return
      // 去掉开头的 ?
      if (search[0] === '?') search = search.slice(1)
      const params = search.split('&')
      for (let i = 0; i < params.length; i++) {
        const [k, v = ''] = params[i].split('=')
        if ((ignoreCase && k.toLowerCase() === key.toLowerCase()) || (!ignoreCase && k === key)) {
          return decodeURIComponent(v)
        }
      }
      return
    }

    // 主 search
    const searchIndex = loc.indexOf('?')
    const hashIndex = loc.indexOf('#')
    let search = ''
    if (searchIndex !== -1) {
      if (hashIndex !== -1 && hashIndex > searchIndex) {
        search = loc.slice(searchIndex, hashIndex)
      } else {
        search = loc.slice(searchIndex)
      }
    }
    value = getParam(search)

    // 如果主 search 没有，尝试 hash 部分
    if (!value && hashIndex !== -1) {
      const hash = loc.slice(hashIndex + 1)
      const hashQueryIndex = hash.indexOf('?')
      if (hashQueryIndex !== -1) {
        const hashQuery = hash.slice(hashQueryIndex)
        value = getParam(hashQuery)
      }
    }

    return value || ''
  } catch (e) {
    console.error('getUrlSearch error', e)
    return ''
  }
}

/**
 * 规范化路径，确保路径以斜杠开始，但不以斜杠结束
 * @param path - 路径字符串
 * @returns 规范化后的路径
 */
export function normalizePath(path: string): string {
  // 确保路径以斜杠开始
  if (!path.startsWith('/')) {
    path = '/' + path
  }

  // 确保路径不以斜杠结束
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return path
}
