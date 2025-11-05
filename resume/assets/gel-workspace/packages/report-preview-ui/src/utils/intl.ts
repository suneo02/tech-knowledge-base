import { isEn, t } from 'gel-util/intl'

export const tForRPPreview = (key: string | number, defaultVal?: string): string | undefined => {
  const intlRes = t(String(key), defaultVal ?? '')
  // 如果是中文环境，检查 defaultVal 是否 和 intlRes 相等, 如果不相等，报错
  if (!isEn() && intlRes !== defaultVal) {
    console.warn(
      `intl result is not same as default value:\tkey: ${key}\tintlRes: ${intlRes}\tdefaultVal: ${defaultVal}`
    )
  }
  return intlRes
}
