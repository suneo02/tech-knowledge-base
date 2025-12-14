/**
 * 简单的国际化工具类
 * 支持中文和英文翻译
 */

import { createHeaderMenuBtn } from '@/components/header/menu'
import { Locale, MessageKey, messages } from './locales'

// 当前语言
let currentLocale: Locale = 'zh-CN'

/**
 * 设置当前语言
 * @param locale 语言代码
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale
  // 保存到 localStorage
  localStorage.setItem('locale', locale)
  // 更新 HTML lang 属性
  document.documentElement.lang = locale
}

export function toggleLocale() {
  setLocale(currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN')
  window.location.reload()
}

/**
 * 获取当前语言
 */
export function getLocale(): Locale {
  return currentLocale
}

/**
 * 初始化语言设置
 */
export function initLocale(): void {
  // 从 localStorage 获取保存的语言设置
  const savedLocale = localStorage.getItem('locale') as Locale
  if (savedLocale && messages[savedLocale]) {
    setLocale(savedLocale)
  } else {
    // 默认使用浏览器语言或中文
    const browserLang = navigator.language
    const defaultLocale: Locale = browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
    setLocale(defaultLocale)
  }
}

/**
 * 类型安全的翻译函数
 * @param key 词条键（自动推断类型）
 * @param params 参数对象
 * @returns 翻译后的文本
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const message = messages[currentLocale]?.[key] || messages['zh-CN'][key] || key

  if (!params) {
    return message
  }

  // 替换参数
  return message.replace(/\{(\w+)\}/g, (match, paramName) => {
    return String(params[paramName] || match)
  })
}

/**
 * 获取语言显示名称
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames: Record<Locale, string> = {
    'zh-CN': '中文',
    'en-US': 'English',
  }
  return displayNames[locale] || locale
}

/**
 * 语言切换器组件
 */
export function createLanguageSwitcher() {
  const container = createHeaderMenuBtn({
    text: currentLocale === 'zh-CN' ? 'English' : '中文',
    onClick: () => {
      toggleLocale()
    },
  })

  return container
}

export const initPageTitle = () => {
  const title = t('common.windCreditService')
  document.title = title
}
