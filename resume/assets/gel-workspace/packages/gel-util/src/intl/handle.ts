import { getUrlSearchValue } from '@/common/url'
import { SupportedLang, SupportedLocale } from './type'

/**
 * langeuage 在 local storage 中的 key
 */

export const LANGUAGE_KEY = 'lan'
/**
 * 默认语言
 */
export const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'

/**
 * BCP47 规范化语言标签并根据已支持资源做优雅降级
 * @param locale 语言标签
 * @important 当前未内置资源，暂时使用中文，之后统一优雅降级为英文
 */
const normalizeLocale = (locale: string | undefined): SupportedLocale => {
  if (!locale) return DEFAULT_LOCALE

  // 统一分隔符与大小写：language-REGION 形式
  const cleaned = String(locale).replace('_', '-').trim()
  const [rawLang] = cleaned.split('-')
  const language = (rawLang || '').toLowerCase()

  // 中文族群：包含 zh、zh-hans、zh-hant 等，统一回退 zh-CN 资源
  if (language === 'zh' || language.startsWith('zh')) {
    return 'zh-CN'
  }

  // 英文族群统一到 en-US 资源
  if (language === 'en' || language.startsWith('en')) {
    return 'en-US'
  }

  // 其他语言（如 ja/ko/fr/de/es/...）当前未内置资源，暂时使用中文
  return 'zh-CN' // 之后统一优雅降级为英文
}

const normalizeNavigatorLanguage = (): SupportedLocale => {
  const nav: Navigator | undefined = typeof navigator !== 'undefined' ? navigator : undefined
  const languages =
    nav && 'languages' in nav ? (nav as unknown as { languages?: readonly string[] }).languages : undefined
  const lang = (languages && languages[0]) || nav?.language
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
