import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { getLocale } from './handle'
import { loadFlatDict } from './locales/flat'

const currentLng = getLocale()
const resources: Record<string, any> = {}
const i18nInstance = i18next.createInstance()
i18nInstance
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'zh-CN',
    debug: true,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    lng: currentLng,
  })

loadFlatDict(currentLng as 'zh-CN' | 'en-US').then((dict) => {
  i18nInstance.addResourceBundle(currentLng, 'common', dict, true, true)
  i18nInstance.changeLanguage(currentLng)
})

export const i18n = i18nInstance

const originalT = i18n.t.bind(i18n)

type InterpolationOptions = {
  [key: string]: any
}

export const t = (key: string, defaultValue?: string, options?: InterpolationOptions): string | any => {
  if (!options) {
    return originalT(key, { defaultValue })
  }

  const reactNodes: { [key: string]: any } = {}

  const stringOptions: { [key: string]: any } = {}

  Object.entries(options).forEach(([k, v]) => {
    if (typeof v === 'object' && v !== null && '$$typeof' in v) {
      reactNodes[k] = v
      stringOptions[k] = `__react_node_${k}__`
    } else {
      stringOptions[k] = v
    }
  })

  if (Object.keys(reactNodes).length === 0) {
    return originalT(key, { defaultValue, ...options })
  }

  const translation = originalT(key, { defaultValue, ...stringOptions })

  if (typeof translation !== 'string') {
    return translation
  }

  let parts: any = [translation]

  for (const [k, node] of Object.entries(reactNodes)) {
    const placeholder = `__react_node_${k}__`
    const newParts: any = []
    for (const part of parts) {
      if (typeof part === 'string') {
        const splitParts = part.split(placeholder)
        for (let i = 0; i < splitParts.length; i++) {
          if (splitParts[i]) {
            newParts.push(splitParts[i])
          }
          if (i < splitParts.length - 1) {
            newParts.push(node)
          }
        }
      } else {
        newParts.push(part)
      }
    }
    parts = newParts
  }

  return parts
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
    return str.replace(/\{([^}]+)\}/g, (match: string, p1: string) => {
      return defaultV[p1] || match
    })
  } else {
    return t(String(key))
  }
}

/**
 * 不展示序号
 * @deprecated 这个方法非常奇怪，后续不要这么写
 * @param key
 * @param defaultV
 * @returns
 */
export const tNoNO = (key: string | number, defaultV?: string) => {
  if (key == '138741' || key == '28846') {
    // 序号不展示
    return ''
  }
  return t(String(key), defaultV || '')
}
