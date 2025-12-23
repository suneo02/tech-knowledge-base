/**
 * 浏览器功能检测工具类
 */

/**
 * 检测浏览器是否支持现代CSS特性和是否为较新的Chrome版本
 * @returns {boolean} 是否为现代浏览器
 */
export const isModernBrowserSupported = (): boolean => {
  try {
    // 检测浏览器是否支持CSS inset属性
    const isInsetSupported = CSS.supports('inset: 0')

    // 检测Chrome版本
    const userAgent = navigator.userAgent
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/)
    const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : 999

    // 如果不支持inset或Chrome版本低于86，则认为不是现代浏览器
    return isInsetSupported && chromeVersion >= 86
  } catch (error) {
    // 出现异常时，默认返回true以避免阻止功能
    console.warn('浏览器检测出现异常:', error)
    return true
  }
}

/**
 * 检测浏览器是否支持特定CSS属性
 * @param {string} property CSS属性名
 * @returns {boolean} 是否支持该CSS属性
 */
export const isCSSPropertySupported = (property: string): boolean => {
  try {
    return CSS.supports(property)
  } catch (error) {
    console.warn(`CSS属性${property}检测出现异常:`, error)
    return false
  }
}
