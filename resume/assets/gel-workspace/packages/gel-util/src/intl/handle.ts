import { getUrlSearchValue } from '@/link/handle/param'
import { t } from 'i18next'
import { SupportedLang, SupportedLocale } from './type'

/**
 * langeuage 在 local storage 中的 key
 */

export const LANGUAGE_KEY = 'lan'
/**
 * 默认语言
 */
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'

// 标准化语言代码
const normalizeLocale = (locale: string | undefined): SupportedLocale => {
  if (!locale) return DEFAULT_LOCALE
  const lang = locale.toLowerCase()
  return lang.startsWith('en') ? 'en-US' : 'zh-CN'
}

const normalizeNavigatorLanguage = (): SupportedLocale => {
  const lang = navigator.language
  return normalizeLocale(lang)
}
/**
 * 获取当前语言设置
 *
 * @description
 * 按照以下优先级获取语言设置：
 * 1. URL 参数 (lan 或 lang)
 * 2. 终端设置 (仅在终端内)
 * 3. localStorage 存储 (仅在 web 端)
 * 4. 浏览器语言设置
 * 5. 默认值 (zh-CN)
 *
 * @returns {SupportedLocale} 当前语言设置
 */
export const getLocale = (): SupportedLocale => {
  // 获取 URL 参数
  const urlLang = getUrlSearchValue('lan') || getUrlSearchValue('lang')

  // 1. 优先使用 URL 参数
  if (urlLang) {
    return normalizeLocale(urlLang)
  }

  // 2. 终端内使用终端设置
  if (window.external?.ClientFunc) {
    // TODO: 终端内的语言获取逻辑
    return normalizeNavigatorLanguage()
  }

  // 3. Web 端使用 localStorage
  const storedLang = localStorage.getItem(LANGUAGE_KEY)
  if (storedLang) {
    return normalizeLocale(storedLang)
  }

  // 4. 使用浏览器语言设置
  return normalizeNavigatorLanguage()
}

/**
 * 获取语言 这个返回值一般放在 url 中
 * @returns
 */
export const getLang = (): SupportedLang => {
  return getLocale() === 'en-US' ? 'en' : 'cn'
}

/**
 * 切换语言，仅在Web端提供该功能
 *
 * 如果 当前语言与 浏览器语言相同，则不进行切换，并删除 localStorage 中的语言设置
 * 如果 当前语言与 浏览器语言不同，则切换语言，并设置 localStorage 中的语言设置
 */
export const switchLocaleInWeb = () => {
  const currentLocale = getLocale()
  const browserLocale = normalizeNavigatorLanguage()
  const nextLocale = currentLocale === 'en-US' ? 'zh-CN' : 'en-US'

  if (nextLocale === browserLocale) {
    // 如果目标语言和浏览器默认语言一致，则移除 local storage，回退到浏览器默认
    window.localStorage.removeItem(LANGUAGE_KEY)
  } else {
    // 否则，显式设置 local storage
    window.localStorage.setItem(LANGUAGE_KEY, nextLocale)
  }

  window.location.reload()
}
/**
 * 是否是英文环境
 */
export const isEn = () => {
  return getLocale() === 'en-US'
}

/**
 * @deprecated 临时方案
 * 后续直接调用 t
 * @param _
 * @param defaultV
 * @returns
 */
export const intl = (key: string | number, defaultV?: string | Record<string, string>) => {
  if (typeof defaultV === 'string') {
    return t(String(key), defaultV)
  } else if (typeof defaultV === 'object') {
    // 这里手动替换 {} 中的内容, 使用正则
    const str = t(String(key))
    return str.replace(/\{([^}]+)\}/g, (match, p1) => {
      return defaultV[p1] || match
    })
  } else {
    return t(String(key))
  }
}
