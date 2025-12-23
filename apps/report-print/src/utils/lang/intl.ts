import { getUrlParamLang } from 'report-util/url'

/**
 * @returns
 */
export const isEnForRPPrint = () => {
  try {
    // Check if wind and langControl are available
    if (window.wind && window.wind.langControl) {
      const wind = window.wind

      // Initialize language JSON
      if (wind.langControl.lang) {
        const langByWind = wind.langControl.lang
        if (langByWind && langByWind === 'en') {
          return true
        }
      }
    }

    const urlLang = getUrlParamLang()
    if (urlLang) {
      return urlLang === 'en'
    }
    // 其次获取浏览器语言
    const browserLang = navigator.language
    if (browserLang) {
      return browserLang === 'en'
    }
    return false
  } catch (error) {
    console.trace(error)
    return false
  }
}

export const t = (key: string | number, defaultVal?: string): string | undefined => {
  if (!window.intl) {
    console.error('window.intl is not defined')
    return defaultVal
  }
  const intlRes = window.intl(key, defaultVal)
  // 如果是中文环境，检查 defaultVal 是否 和 intlRes 相等, 如果不相等，报错
  if (!isEnForRPPrint() && intlRes !== defaultVal) {
    console.error(
      `intl result is not same as default value:\tkey: ${key}\tintlRes: ${intlRes}\tdefaultVal: ${defaultVal}`
    )
  }
  return intlRes
}
