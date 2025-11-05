import { LanBackend } from 'gel-api'
import { getLocale, i18n, LANGUAGE_KEY, SupportedLocale } from 'gel-util/intl'
import { local } from '../storage'

export const getLanBackend = (): LanBackend => {
  return getLocale() === 'en-US' ? 'ENS' : 'CHS'
}

/**
 * 切换语言
 * @param locale 目标语言
 * @param updateUrl 是否更新 URL 参数
 */
export const switchLanguage = (locale: SupportedLocale, updateUrl = true) => {
  // 保存到 localStorage
  local.set(LANGUAGE_KEY, locale)

  // 更新 i18next 语言
  i18n.changeLanguage(locale)

  // 更新 URL 参数
  if (updateUrl) {
    const url = new URL(window.location.href)
    url.searchParams.set('lan', locale)
    window.history.replaceState({}, '', url.toString())
  }

  // 触发自定义事件，通知其他组件语言已更改
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { locale } }))
}
