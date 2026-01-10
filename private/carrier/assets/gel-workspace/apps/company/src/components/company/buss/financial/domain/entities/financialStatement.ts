/**
 * 财务报表领域对象：封装指标取值、期间过滤、增长率计算与表格模型生成。
 * @author yxlu.calvin
 * @example
 * const stmt = createFinancialStatement(data, 'domestic')
 * const v = stmt.getMetricValue('_sumBusinessIncome', '2024')
 * const model = stmt.toTableModel({ hideEmptyRows: true, unitScale: 'TEN_THOUSAND' })
 */
import type { FinancialData, FinancialVariant, TableModel, FinancialFilters } from '../../types'

export const createFinancialStatement = (data: FinancialData, variant: FinancialVariant) => {
  const { periods, metrics, scenarios } = data

  const getMetricValue = (metricKey: string, period: string): number | null => {
    const metric = metrics[metricKey]
    return metric?.values[period] ?? null
  }

  const getPeriodsInRange = (startYear?: string | number, endYear?: string | number): string[] => {
    const s = startYear ? parseInt(startYear.toString()) : undefined
    const e = endYear ? parseInt(endYear.toString()) : undefined
    return periods.filter((period) => {
      const yearStr = String(period).slice(0, 4)
      const y = parseInt(yearStr)
      if (Number.isNaN(y)) return true
      if (typeof s !== 'undefined' && y < s) return false
      if (typeof e !== 'undefined' && y > e) return false
      return true
    })
  }
  // 注意：`periods` 可能包含季度或日期字符串，筛选逻辑仅以前4位年份进行过滤

  // 计算数值
  const calculateGrowthRate = (metricKey: string, fromPeriod: string, toPeriod: string): number | null => {
    const fromValue = getMetricValue(metricKey, fromPeriod)
    const toValue = getMetricValue(metricKey, toPeriod)

    if (fromValue === null || toValue === null || fromValue === 0) return null
    return ((toValue - fromValue) / fromValue) * 100
  }

  const toTableModel = (filters: FinancialFilters): TableModel => {
    const filteredPeriods = getPeriodsInRange(filters.reportDate?.[0], filters.reportDate?.[1])

    const rows = Object.entries(metrics)
      .filter(([, metric]) => {
        if (filters.hideEmptyRows) {
          return filteredPeriods.some((period) => metric.values[period] != null)
        }
        return true
      })
      .map(([key, metric]) => ({
        key,
        label: metric.label,
        values: Object.fromEntries(filteredPeriods.map((period) => [period, metric.values[period] ?? null])),
      }))

    const labels: Record<string, string> = {}
    filteredPeriods.forEach((p) => {
      const l = (data as any).periodLabels?.[p]
      if (l) labels[p] = l
    })
    // periodLabels：由数据客户端适配的报告期文案（如“年报/中期/季报”），按列映射
    return {
      columns: filteredPeriods,
      rows,
      meta: filters,
      periodLabels: labels,
    }
  }

  return {
    get companyCode() {
      return data.companyCode
    },
    get variant() {
      return variant
    },
    get currencyDim() {
      return (data as any).currencyDim
    },
    get periods() {
      return [...periods]
    },
    getPeriodLabel(period: string) {
      return (data as any).periodLabels?.[period]
    },
    getPeriodLabels() {
      return { ...((data as any).periodLabels || {}) }
    },
    getMetricValue,
    getPeriodsInRange,
    calculateGrowthRate,
    toTableModel,
  }
}
