import { compressHiddenNodes, decompressHiddenNodes } from './hiddenStatus'
import { getUrlSearch } from './misc'

/**
 * 编码 隐藏节点 为字符串
 */
export const encodeHiddenNodes = (hiddenNodes: string[]): string => {
  try {
    return encodeURIComponent(compressHiddenNodes(hiddenNodes))
  } catch (error) {
    return ''
  }
}

/**
 * 获取 URL 中的 'pattern' 参数。
 * @returns 'pattern' 参数的值，如果不存在则返回 null。
 */
export const getUrlParamPattern = () => {
  return getUrlSearch('pattern')
}

/**
 * 兼容性地获取公司代码。
 * 会依次从 URL 参数 'companyCode' 和 'pattern' 参数中查找。
 * @returns 公司代码字符串，如果找不到则返回 undefined。
 */
export const getUrlParamCorpCode = (): string | undefined => {
  const urlParam = getUrlSearch('companyCode')
  if (urlParam) {
    return urlParam
  }

  return undefined
}

/**
 * 兼容性地获取语言设置。
 * 会依次从 URL 参数 ('lang' 或 'lan') 和 'pattern' 参数中查找。
 * @returns 语言字符串，如果找不到则返回空字符串。
 */
export const getUrlParamLang = (): string | undefined => {
  const urlLang = getUrlSearch('lang') || getUrlSearch('lan')
  if (urlLang) {
    return urlLang
  }

  return undefined
}

/**
 * 兼容性地获取隐藏的节点ID。
 * 此函数能够处理两种 'pattern' 格式：
 * 1. 直接是隐藏节点ID编码后的字符串。
 * 2. 包含 'hiddenNodes' 字段的JSON对象。
 * @returns 解码后的隐藏节点ID数组。
 */
export const getUrlParamHiddenNodes = (): string[] => {
  try {
    const patternStr = getUrlParamPattern()
    if (patternStr) {
      return decompressHiddenNodes(decodeURIComponent(patternStr))
    }
    return []
  } catch (error) {
    return []
  }
}
