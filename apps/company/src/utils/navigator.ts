/**
 * 检测是否需要应用兼容性修复
 * 只在 Chrome/Edge 83 及以下版本应用
 */
export const needsBrowserCompat = (): boolean => {
  // 如果不在浏览器环境中，不应用修复
  if (typeof window === 'undefined' || !window.navigator) {
    return false
  }

  const userAgent = window.navigator.userAgent

  // 检测是否是 Chrome 或基于 Chromium 的 Edge
  const isChromium = /Chrome\//.test(userAgent) || /Edg\//.test(userAgent)
  if (!isChromium) {
    return false // 不是 Chrome 系列浏览器不需要修复
  }

  // 提取版本号
  let version = 0
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/)
  const edgeMatch = userAgent.match(/Edg\/(\d+)/)

  if (chromeMatch && chromeMatch[1]) {
    version = parseInt(chromeMatch[1], 10)
  } else if (edgeMatch && edgeMatch[1]) {
    version = parseInt(edgeMatch[1], 10)
  }

  // 只在版本号 <= 83 的情况下应用修复
  return version > 0 && version <= 83
}

export const isLegacyBrowser = needsBrowserCompat()
