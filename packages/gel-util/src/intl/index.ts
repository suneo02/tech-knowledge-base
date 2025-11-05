export { t } from 'i18next'
export { getLang, getLocale, intl, isEn, LANGUAGE_KEY, switchLocaleInWeb } from './handle'
export { imlCn, imlEn } from './locales'
export { translateComplexHtmlData } from './translate'
export type { SupportedLocale } from './type'

import i18next from 'i18next'
import { getLocale } from './handle'
import { imlCn, imlEn } from './locales'

i18next.init({
  resources: {
    'zh-CN': {
      translation: imlCn,
    },
    'en-US': {
      translation: imlEn,
    },
  },
  lng: getLocale(),
  fallbackLng: 'zh-CN',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
})

export const i18n = i18next
