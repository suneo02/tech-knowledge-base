import i18n, { type InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'

export interface LocalesI18nOptions {
  /** 支持的语言列表（与文件后缀一致） */
  supportedLngs?: string[]
  /** 默认语言（与文件后缀一致） */
  fallbackLng?: string
  /** 默认命名空间（对应文件名的前缀） */
  defaultNS?: string
  /** 额外的初始化选项 */
  initOptions?: Partial<InitOptions>
}

type LocaleData = Record<string, string>

// 预加载 src/locales/namespaces 下所有 json，支持扁平和二级目录（<ns>/<ns>.<lang>.json）
// @ts-expect-error ttt
const EAGER_MODULES = import.meta.glob('./namespaces/**/*.json', { eager: true }) as unknown as Record<string, any>

const buildResourcesFromModules = (mods: Record<string, any>) => {
  const resources: Record<string, Record<string, LocaleData>> = {}
  for (const [key, mod] of Object.entries(mods)) {
    const data: LocaleData = (mod && 'default' in mod ? (mod as any).default : (mod as any)) || {}
    // 尝试两种匹配：
    // 1) ./namespaces/common.en.json → ns=common, lang=en
    // 2) ./namespaces/windHeader/windHeader.en.json → ns=windHeader, lang=en
    let m = key.match(/\/namespaces\/([^\/]+)\.([^.]+)\.json$/)
    let ns = ''
    let lang = ''
    if (m) {
      ns = m[1]
      lang = m[2]
    } else {
      const m2 = key.match(/\/namespaces\/([^\/]+)\/\1\.([^.]+)\.json$/)
      if (m2) {
        ns = m2[1]
        lang = m2[2]
      } else {
        continue
      }
    }

    if (!resources[lang]) resources[lang] = {}
    resources[lang][ns] = { ...(resources[lang][ns] || {}), ...data }
  }
  return resources
}

type NavigatorWithUserLanguage = Navigator & { userLanguage?: string }
const detectBrowserLanguage = (supportedLngs: string[], fallbackLng: string): string => {
  // 1) URL 参数优先: lan/lang -> 'en'|'cn' 或 'en-US'|'zh-CN'
  try {
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
      const search = window.location.search || ''
      const params = new URLSearchParams(search)
      const raw = params.get('lan') || params.get('lang')
      if (raw) {
        const lower = raw.toLowerCase()
        if (supportedLngs.includes(lower)) return lower
        if (lower.startsWith('en')) return 'en'
        if (lower.startsWith('zh')) return 'cn'
      }
    }
  } catch (e) {
    void e
  }

  // 2) localStorage: 'lan' -> 'en-US'|'zh-CN'
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('lan') || ''
      const lower = stored.toLowerCase()
      if (lower) {
        if (supportedLngs.includes(lower)) return lower
        if (lower.startsWith('en')) return 'en'
        if (lower.startsWith('zh')) return 'cn'
      }
    }
  } catch (e) {
    void e
  }

  // 3) 浏览器语言
  if (typeof navigator === 'undefined') return fallbackLng
  const nav = navigator as NavigatorWithUserLanguage
  const lang = (nav.language || nav.userLanguage || fallbackLng).toLowerCase()
  if (supportedLngs.includes(lang)) return lang
  if (lang.startsWith('zh')) return 'cn'
  return fallbackLng
}

export const createLocalesI18n = (options: LocalesI18nOptions = {}) => {
  const {
    supportedLngs = ['en', 'cn'],
    fallbackLng = 'en',
    defaultNS = 'common',
    initOptions: userInitOptions = {},
  } = options

  const resources = buildResourcesFromModules(EAGER_MODULES)
  const instance = i18n.createInstance()
  const initOptions: InitOptions = {
    lng: detectBrowserLanguage(supportedLngs, fallbackLng),
    fallbackLng,
    supportedLngs,
    defaultNS,
    ns: [defaultNS],
    resources,
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
    ...userInitOptions,
  }

  instance.use(initReactI18next).init(initOptions)
  return instance
}

export const defaultLocalesI18n = createLocalesI18n()
export default defaultLocalesI18n

// 便捷导出，兼容旧的调用习惯（但从 gel-util/locales 引入）
export const t = defaultLocalesI18n.t.bind(defaultLocalesI18n)
export { getLang, getLocale, isEn, LANGUAGE_KEY, switchLocaleInWeb } from '../intl/handle'
