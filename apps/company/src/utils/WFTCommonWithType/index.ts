import { formatPercent, formatPercentWithTwoDecimalWhenZero } from '@/utils/format/percentage.ts'
import { formatMoney } from '@/utils/format/currency.ts'

export const wftCommonType = {
  // 是否终端内使用
  usedInClient: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window.external && (window.external as any).ClientFunc)
  },
  // 是否开发模式、还是生产模式
  isDevDebugger: () => {
    return (process as any)?.env.NODE_ENV !== 'production'
  },

  /**
   * 兜底方案判断 id 人物还是企业
   * @param id
   */
  getIdIfCompanyOrPerson: (id: string) => {
    try {
      const idParsed = String(id)

      if (idParsed.length <= 15) {
        return 'company'
      } else {
        return 'person'
      }
    } catch (e) {
      console.error(e)
      return 'company'
    }
  },
  displayPercent: formatPercent,
  displayPercentWithTwoDecimalWhenZero: formatPercentWithTwoDecimalWhenZero,
  formatMoney,
}
