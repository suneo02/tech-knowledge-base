import { TIntl } from '@/types/misc'

/**
 * 配置国际化通用处理
 * @param config 配置
 * @param txtKey 文本key
 */
export const configDetailIntlHelper = (config: any, txtKey: string, t: TIntl) => {
  try {
    if (!config) {
      console.warn(`${txtKey} 配置为空`)
      return ''
    }
    const txtIntlKey = `${txtKey}Intl`
    if (config[txtIntlKey]) {
      const intlRes = t(config[txtIntlKey], config[txtKey])
      return intlRes
    }
    return config[txtKey]
  } catch (error) {
    console.error(`${txtKey} 国际化配置错误`, error)
    return config[txtKey]
  }
}
