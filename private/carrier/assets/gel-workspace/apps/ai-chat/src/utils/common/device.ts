export const getOSSystem = (): string => {
  const ua = navigator.userAgent || ''
  const platform = navigator.platform || ''
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS'
  if (/android/i.test(ua)) return 'Android'
  if (/win/i.test(platform)) return 'Windows'
  if (/mac/i.test(platform)) return 'MacOS'
  if (/linux/i.test(platform)) return 'Linux'
  return 'Unknown'
}

export const getDeviceType = (): string => {
  const ua = navigator.userAgent || ''
  if (/mobile|iphone|ipod|android|blackberry|iemobile|kindle|silk-accelerated|hpwos/i.test(ua)) return 'mobile'
  if (/ipad|tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

export const getPageSource = (): string => {
  return document.referrer || ''
}
