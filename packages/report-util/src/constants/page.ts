import { TIntl } from '@/types'
import { getRPCommonLocale } from './common'

export const getPageFooterLocales = (t: TIntl, isEn: boolean) => {
  const reportDate = getRPCommonLocale(t, isEn).reportDate
  return {
    // 报告日期：2025-04-17 20:48 请务必阅读报告前的免责声明。 第1页 共105页
    printPageFooterLeftText: `${reportDate} ${isEn ? 'Please be sure to read the disclaimer before reporting.' : '请务必阅读报告前的免责声明。'}`,
    printPageFooterRightText: isEn ? 'Page % page  of % total' : '第%页 共%页',
  }
}

// ** 企业深度信用报告

export const getPageHeaderLocales = (corpName: string, reportTitle: string, isEn: boolean) => {
  return `${corpName || ''}${isEn ? ' ' : ''}${reportTitle}`
}
