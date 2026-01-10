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

const LAZY_MODULES = import.meta.glob('./namespaces/**/*.json') as unknown as Record<string, () => Promise<any>>

const loadResourcesForLang = async (mods: Record<string, () => Promise<any>>, targetLang: string) => {
  const resources: Record<string, LocaleData> = {}
  const entries = Object.entries(mods)
  const matchLang = (p: string) => {
    const m1 = p.match(/\/namespaces\/([^\/]+)\.([^.]+)\.json$/)
    if (m1) return m1[2] === targetLang ? m1[1] : ''
    const m2 = p.match(/\/namespaces\/([^\/]+)\/\1\.([^.]+)\.json$/)
    if (m2) return m2[2] === targetLang ? m2[1] : ''
    return ''
  }
  const tasks: Array<Promise<void>> = []
  for (const [key, loader] of entries) {
    const ns = matchLang(key)
    if (!ns) continue
    tasks.push(
      loader().then((mod) => {
        const data: LocaleData = (mod && 'default' in mod ? (mod as any).default : (mod as any)) || {}
        resources[ns] = { ...(resources[ns] || {}), ...data }
      })
    )
  }
  await Promise.all(tasks)
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

  const instance = i18n.createInstance()
  const initOptions: InitOptions = {
    lng: detectBrowserLanguage(supportedLngs, fallbackLng),
    fallbackLng,
    supportedLngs,
    defaultNS,
    ns: [defaultNS],
    resources: {},
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
    ...userInitOptions,
  }
  instance.use(initReactI18next).init(initOptions)
  ;(async () => {
    const lang = initOptions.lng || fallbackLng
    const res = await loadResourcesForLang(LAZY_MODULES, lang)
    Object.entries(res).forEach(([ns, data]) => {
      instance.addResourceBundle(lang, ns, data, true, true)
    })
  })()
  return instance
}

export const defaultLocalesI18n = createLocalesI18n()
export default defaultLocalesI18n

// 便捷导出，兼容旧的调用习惯（但从 gel-util/locales 引入）
export const t = defaultLocalesI18n.t.bind(defaultLocalesI18n)
export { getLang, getLocale, isEn, LANGUAGE_KEY, switchLocaleInWeb } from '../intl/handle'
