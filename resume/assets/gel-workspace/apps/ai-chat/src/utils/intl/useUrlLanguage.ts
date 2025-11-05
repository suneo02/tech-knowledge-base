import { getLocale, i18n, SupportedLocale } from 'gel-util/intl'
import { useEffect } from 'react'
import { switchLanguage } from './handle'

/**
 * 处理 URL 语言参数的 hook
 * @returns {void}
 */
export const useUrlLanguage = () => {
  useEffect(() => {
    // 获取当前语言设置
    const currentLocale = getLocale()

    // 初始化时同步语言设置
    switchLanguage(currentLocale, false)

    // 监听 URL 变化
    const handleUrlChange = () => {
      const newLocale = getLocale()
      if (newLocale !== currentLocale) {
        switchLanguage(newLocale, false)
      }
    }

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<{ locale: SupportedLocale }>) => {
      const { locale } = event.detail
      if (i18n.language !== locale) {
        switchLanguage(locale, true)
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [i18n])
}
