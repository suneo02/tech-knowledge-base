import { getLocale } from 'gel-util/intl'
import type React from 'react'
// 语言与来源等 URL 参数工具方法
// 目标：新增参数时仅改一个地方（参数注册表），无需改动解析/拼接逻辑

// —— 基础类型 ——
export interface LangSourceParams {
  language: 'cn' | 'en' | 'jp'
  source: 'Baifen' | 'laimi' | ''
}

type Language = LangSourceParams['language']
type Source = LangSourceParams['source']
// 预留扩展时可开启：
// type Target = LangSourceParams['target']
// type NoSearch = LangSourceParams['nosearch']
// type IsSeparate = LangSourceParams['isSeparate']

// —— 工具函数 ——
const mapLocaleToLanguage = (loc: string): Language => {
  if (loc === 'en-US') return 'en'
  if (loc === 'ja-JP' || loc.toLowerCase().startsWith('ja')) return 'jp'
  if (loc === 'zh-CN') return 'cn'
  return 'cn'
}

const isValidLanguage = (lan: string | null): lan is Language => lan === 'cn' || lan === 'en' || lan === 'jp'
const normalizeSource = (src: string | null): Source => (src === 'Baifen' || src === 'laimi' ? src : '')

// —— 参数注册表：新增参数只需在这里追加一项 ——
interface ParamDef<V> {
  aliases?: readonly string[]
  parse: (raw: string | null) => V
  default: () => V
  serialize?: (value: V) => string
}

const PARAMS = {
  // lan: 语言，兼容传入 language 作为别名
  lan: {
    aliases: ['language'] as const,
    parse: (raw: string | null): Language => (isValidLanguage(raw) ? raw : mapLocaleToLanguage(getLocale())),
    default: (): Language => mapLocaleToLanguage(getLocale()),
    serialize: (v: Language) => v,
  } satisfies ParamDef<Language>,

  // from: 来源，兼容传入 source 作为别名
  from: {
    aliases: ['source'] as const,
    parse: (raw: string | null): Source => normalizeSource(raw),
    default: (): Source => '',
    serialize: (v: Source) => v,
  } satisfies ParamDef<Source>,
} as const

type Registry = typeof PARAMS
type CanonicalKey = keyof Registry
type Params = { [K in CanonicalKey]: ReturnType<Registry[K]['parse']> }

const aliasToCanonical: Record<string, CanonicalKey> = Object.keys(PARAMS).reduce(
  (acc, key) => {
    const k = key as CanonicalKey
    acc[k] = k
    const aliases = PARAMS[k].aliases ?? []
    aliases.forEach((a) => (acc[a] = k))
    return acc
  },
  {} as Record<string, CanonicalKey>
)

const toCanonical = (key: string): CanonicalKey | undefined => aliasToCanonical[key]

const readUrl = (): URL => {
  const href = typeof window !== 'undefined' ? window.location.href : ''
  const base = href || 'http://localhost/'
  return new URL(base)
}

const buildUrl = (url: string): { u: URL; isAbsolute: boolean } => {
  const isAbsolute = /^https?:\/\//i.test(url) || url.startsWith('//')
  const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  const u = new URL(url, isAbsolute ? undefined : base)
  return { u, isAbsolute }
}

const getAllParamsFromUrl = (): Params => {
  const url = readUrl()
  const entries = Object.keys(PARAMS).map((key) => {
    const k = key as CanonicalKey
    const def = PARAMS[k]
    const raw = url.searchParams.get(k)
    const value = def.parse(raw)
    return [k, value] as const
  })
  return Object.fromEntries(entries) as Params
}

export const parseLangSourceFromUrl = (): LangSourceParams => {
  const all = getAllParamsFromUrl()
  return { language: all.lan, source: all.from }
}

export const getCurrentLanguage = (): Language => parseLangSourceFromUrl().language

export const isChinese = () => getCurrentLanguage() === 'cn'
export const isEnglish = () => getCurrentLanguage() === 'en'
export const isJapanese = () => getCurrentLanguage() === 'jp'

export interface AppendOptions {
  override?: boolean
  // 支持传入别名或规范键，如 { language: 'en' } 或 { lan: 'en' }
  params?: Partial<Record<string, unknown>>
}

export const appendLangSourceToUrl = (url: string, options: AppendOptions = {}): string => {
  const { override = false, params } = options

  const current = getAllParamsFromUrl()

  const next: Partial<Params> = { ...current }

  if (params) {
    Object.entries(params).forEach(([inputKey, inputValue]) => {
      const canonical = toCanonical(inputKey)
      if (!canonical) return
      const def = PARAMS[canonical]
      const raw = inputValue === null || inputValue === undefined ? null : String(inputValue)
      // 使用 parse 进行归一化，以保证类型安全
      ;(next as Record<string, unknown>)[canonical] = def.parse(raw)
    })
  }

  const { u, isAbsolute } = buildUrl(url)

  ;(Object.keys(PARAMS) as CanonicalKey[]).forEach((k) => {
    const has = !!u.searchParams.get(k)
    if (override || !has) {
      const def = PARAMS[k]
      const val = (next as Params)[k] ?? def.default()
      const serialized = def.serialize ? (def.serialize as (v: unknown) => string)(val as unknown) : String(val)
      u.searchParams.set(k, serialized)
      // 避免存在别名残留，清理可能的别名键
      const aliasList = (def.aliases ?? ([] as readonly string[])) as readonly string[]
      aliasList.forEach((alias) => u.searchParams.delete(alias))
    }
  })

  const pathnameWithQuery = `${u.pathname}${u.search}`
  const full = `${pathnameWithQuery}${u.hash}`
  return isAbsolute ? u.toString() : full
}

// 根据当前语言返回硬编码词条（当不能使用 t() 时）
export const pickByLanguage = <T extends Record<'cn' | 'en' | 'jp', string | React.ReactNode>>(
  table: T
): string | React.ReactNode => {
  const lan = getCurrentLanguage()
  return table[lan]
}
