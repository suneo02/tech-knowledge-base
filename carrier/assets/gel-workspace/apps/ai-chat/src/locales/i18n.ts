import { imlCn, imlEn } from 'gel-util/intl'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  'zh-CN': {
    common: imlCn,
  },
  'en-US': {
    common: imlEn,
  },
}
const i18n = i18next.createInstance()
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'zh-CN',
    debug: import.meta.env.DEV,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false, // When using resources, no need for suspense
    },
  })

export interface TFunc {
  (key: string, defaultValue?: string): string
}

export const t: TFunc = (key, defaultValue) => {
  return i18n.t(key, defaultValue as any) as string
}

export default i18n
