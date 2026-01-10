/**
 * Mock 数据生成器：依据公司代码从模拟接口响应构造 `FinancialData` 结构。
 * @author yxlu.calvin
 * @example
 * const data = createMockFinancialData('1057626844')
 */
import { mockApiFinancialData } from './mockApiFinancialData'
import { t } from 'gel-util/intl'

const STRINGS = {
  SUM_OF_ASSET: t('45337', '资产总计'),
  SUM_OF_DEBT: t('46149', '负债合计'),
  SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1: t('6822', '归属母公司股东权益'),
  SUM_OF_HOLDER_RIGHTS_AND_INTERESTS2: t('', '归属母公司股东权益(二)'),
  DEFAULT_SCENARIO: t('439218', '默认'),
} as const

export const createMockFinancialData = (companyCode: string) => {
  const rows = mockApiFinancialData.Data.filter((d) => d.companyCode === companyCode || !companyCode)
  const periods = Array.from(new Set(rows.map((r) => String(r._reportDate))))

  const labelMap: Record<string, string> = {
    _sumOfAsset: STRINGS.SUM_OF_ASSET,
    _sumOfDebt: STRINGS.SUM_OF_DEBT,
    _sumOfHolderRightsAndInterests1: STRINGS.SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1,
    _sumOfHolderRightsAndInterests2: STRINGS.SUM_OF_HOLDER_RIGHTS_AND_INTERESTS2,
  }

  const metricKeys = Object.keys(rows.reduce((acc, r) => Object.assign(acc, r), {})).filter((k) => k.startsWith('_'))

  const metrics = Object.fromEntries(
    metricKeys.map((key) => {
      const values = Object.fromEntries(
        periods.map((p, idx) => {
          const row = rows.find((r) => String(r._reportDate) === p)
          let v = row ? (row as any)[key] : undefined
          const miss = (idx + key.length) % 2 === 1
          if (v !== undefined && miss) v = undefined
          return [p, v === undefined ? null : (v as number)]
        })
      )
      return [key, { label: labelMap[key] || key, values }]
    })
  )

  return {
    companyCode: rows[0]?.companyCode || companyCode,
    periods,
    metrics,
    scenarios: [{ name: STRINGS.DEFAULT_SCENARIO }],
  }
}
