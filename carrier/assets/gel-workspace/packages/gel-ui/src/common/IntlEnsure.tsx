import { i18n } from 'gel-util/intl'
import { FC } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
export { I18nextProvider, useTranslation } from 'react-i18next'
/**
 * 确保 i18n 初始化完成
 * @param param0
 * @returns
 */
export const IntlEnsure: FC<{ children: React.ReactNode }> = ({ children }) => {
  // @ts-expect-error ttt
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export const useIntl = () => {
  const { t } = useTranslation()
  return t
}
