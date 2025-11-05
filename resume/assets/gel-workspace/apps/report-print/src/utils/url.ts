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

/**
 * 将对象序列化为URL查询字符串
 * @param params - 查询参数对象
 * @returns URL查询字符串（不含'?'前缀）
 */
export function serializeQueryParams(params: Record<string, any>): string {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .map((key) => {
      const value = params[key]
      const encodedValue = String(value)
      return `${key}=${encodedValue}`
    })
    .join('&')
}

/**
 * 构建完整URL
 * @param baseUrl - 基础URL
 * @param path - 路径
 * @param queryParams - 查询参数对象
 * @returns 完整的URL字符串
 */
export function buildUrl(baseUrl: string, path: string, queryParams: Record<string, any> = {}): string {
  try {
    // 规范化基础URL和路径
    let fullUrl: string

    // 处理空或无效的baseUrl
    if (!baseUrl || baseUrl === '') {
      // 如果baseUrl为空，直接使用path作为完整URL的起点
      fullUrl = path.startsWith('/') ? path : '/' + path
    } else {
      // 确保baseUrl以斜杠结束
      const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'

      // 确保path不以斜杠开始（因为baseUrl已经以斜杠结束）
      const formattedPath = path.startsWith('/') ? path.substring(1) : path

      // 组合baseUrl和path
      fullUrl = formattedBaseUrl + formattedPath
    }

    // 构建查询参数字符串
    if (Object.keys(queryParams).length > 0) {
      const queryString = serializeQueryParams(queryParams)
      if (queryString) {
        // 添加查询参数分隔符
        fullUrl += (fullUrl.indexOf('?') !== -1 ? '&' : '?') + queryString
      }
    }

    return fullUrl
  } catch (e) {
    console.trace(e)
    console.warn(['buildUrl error:', e].map((item) => JSON.stringify(item)).join('\t'))
    return ''
  }
}
