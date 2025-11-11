import { localeApply } from './apply'
import { localeCommon } from './common'
import { discilaimerLocale } from './discilaimer'
import { localeFooter } from './footer'
import { localeRisk } from './risk'

// 定义支持的语言类型
export type Locale = 'zh-CN' | 'en-US'

// 词条数据
export const messages = {
  'zh-CN': {
    ...localeCommon['zh-CN'],
    ...localeFooter['zh-CN'],
    ...localeRisk['zh-CN'],
    ...localeApply['zh-CN'],
    ...discilaimerLocale['zh-CN'],
  },
  'en-US': {
    ...localeCommon['en-US'],
    ...localeFooter['en-US'],
    ...localeRisk['en-US'],
    ...localeApply['en-US'],
    ...discilaimerLocale['en-US'],
  },
} as const

// 从词条数据中推断出所有可用的词条 ID 类型
export type MessageKey = keyof (typeof messages)['zh-CN']

// 定义词条类型
export interface IntlMessages {
  [key: string]: string
}

// 类型安全的词条数据
export const typedMessages: Record<Locale, IntlMessages> = messages as Record<Locale, IntlMessages>
