import { isDev } from '@/utils/env'
import {
  appendLangSourceToUrl,
  getCurrentLanguage,
  parseLangSourceFromUrl,
  type LangSourceParams,
} from '@/utils/langSource'
import { usedInClient } from 'gel-util/env'
import { COMMON_PARAM_KEYS, INNER_LINK_PARAM_KEYS } from 'gel-util/link'
import { useCallback, useMemo } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'

export interface UseLangSourceResult extends LangSourceParams {
  appendToUrl: (url: string, options?: { override?: boolean; params?: Partial<LangSourceParams> }) => string
  isCN: boolean
  isEN: boolean
  isJP: boolean
}

export const useLangSource = (): UseLangSourceResult => {
  const parsed = useMemo(() => parseLangSourceFromUrl(), [])
  const language = useMemo(() => getCurrentLanguage(), [])

  return {
    language,
    source: parsed.source,
    appendToUrl: (url, options) => appendLangSourceToUrl(url, options),
    isCN: language === 'cn',
    isEN: language === 'en',
    isJP: language === 'jp',
  }
}

export default useLangSource

// 包装 navigate，使跳转默认携带当前 lan/from
export type NavigateWithOpenOptions = NavigateOptions & {
  // 设置为 true 时，不使用路由跳转而是调用 window.open
  openWindow?: boolean
  // 传给 window.open 的查询参数，仅在 openWindow=true 时生效
  windowSearchParams?: URLSearchParams | Record<string, unknown>
  // 传给 window.open 的 options，仅在 openWindow=true 时生效
  windowOptions?: OpenWindowOptions
  // 在 openWindow 模式下是否附加 lan/from（默认不附加，保持“原样跳转”）
  appendLangSource?: boolean
}

export const useNavigateWithLangSource = () => {
  const navigate = useNavigate()

  return useCallback(
    (to: string, options?: NavigateWithOpenOptions) => {
      if (window.location.ancestorOrigins?.length) {
        let baseUrl: URL
        if (usedInClient()) {
          baseUrl = new URL(
            `${window.location.ancestorOrigins[0]}/Wind.WFC.Enterprise.Web/PC.Front/Company/index.html#/innerlinks`
          )
        } else if (isDev) {
          baseUrl = new URL(`${window.location.ancestorOrigins[0]}/index.html#/innerlinks`)
        } else {
          baseUrl = new URL(`${window.location.ancestorOrigins[0]}/web/ai/index.html#/innerlinks`)
        }

        const toUrl = new URL(to, window.location.origin)
        const pathname = toUrl.pathname
        console.log('🚀 ~ useNavigateWithLangSource ~ toUrl:', toUrl)
        let target = 'super'
        if (pathname.includes('super/chat')) {
          target = 'superChat'
          const conversationId = pathname.replace('/super/chat/', '')
          baseUrl.searchParams.set('id', conversationId)
        } else if (pathname.includes('credits')) {
          target = 'credits'
        }

        // 透传原始查询参数（例如 type=CDE 等）
        toUrl.searchParams.forEach((value, key) => {
          baseUrl.searchParams.set(key, value)
        })

        baseUrl.searchParams.set(INNER_LINK_PARAM_KEYS.TARGET, target)
        baseUrl.searchParams.set(COMMON_PARAM_KEYS.NOSEARCH, '1')
        baseUrl.searchParams.set(COMMON_PARAM_KEYS.ISSEPARATE, '1')

        window.open(baseUrl.toString())
        return
      }
      const { openWindow, windowSearchParams, windowOptions, appendLangSource, ...rest } = options ?? {}

      if (openWindow) {
        const urlForOpen = appendLangSource ? appendLangSourceToUrl(to) : to
        openWindowWithParams({ url: urlForOpen, searchParams: windowSearchParams, options: windowOptions })
        return
      }

      const url = appendLangSourceToUrl(to)
      navigate(url, rest)
    },
    [navigate]
  )
}

// —— window.open 专用方法（仅合并显式传入的 searchParams 与原链接，其余不做特殊处理）——
export interface OpenWindowOptions {
  target?: string
  features?: string | Record<string, string | number | boolean>
  replace?: boolean
}

export interface OpenWindowParams {
  url: string
  searchParams?: URLSearchParams | Record<string, unknown>
  options?: OpenWindowOptions
}

const serializeFeatures = (features?: string | Record<string, string | number | boolean>): string | undefined => {
  if (!features) return undefined
  if (typeof features === 'string') return features

  const entries = Object.entries(features).flatMap(([key, value]) => {
    if (value === undefined || value === null) return []
    if (typeof value === 'boolean') return [`${key}=${value ? 'yes' : 'no'}`]
    return [`${key}=${String(value)}`]
  })

  return entries.join(',') || undefined
}

export const openWindowWithParams = ({ url, searchParams, options }: OpenWindowParams): Window | null => {
  if (typeof window === 'undefined' || typeof window.open !== 'function') return null

  const base = window.location?.origin || 'http://localhost'
  const isAbsolute = /^https?:\/\//i.test(url) || url.startsWith('//')
  const u = new URL(url, isAbsolute ? undefined : base)

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      u.searchParams.set(key, value)
    })
  } else if (searchParams && typeof searchParams === 'object') {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        u.searchParams.delete(key)
        return
      }
      u.searchParams.set(key, String(value))
    })
  }

  const { target, features, replace } = options ?? {}
  const featureString = serializeFeatures(features)
  const finalUrl = isAbsolute ? u.toString() : `${u.pathname}${u.search}${u.hash}`

  if (replace && (!target || target === '_self')) {
    window.location.replace(finalUrl)
    return null
  }

  return window.open(finalUrl, target, featureString)
}
