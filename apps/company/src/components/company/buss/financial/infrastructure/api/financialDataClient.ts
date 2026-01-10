/**
 * 财务数据客户端：拼装查询参数并请求后端接口，按变体指标集合构造统一的 `FinancialData`。
 * @author yxlu.calvin
 * @example
 * const client = createFinancialDataClient({ timeout: 30000, useMockOnError: true })
 * const data = await client.fetchFinancialData('600000', 'domestic', { reportTemplate: '年报&累计报' })
 * @remarks
 * - 接口路径：`detail/company/financialreportsummary`
 * - `regionType` 映射：overseas→OE，其他→CN；可被 `filters.regionType` 覆盖
 * - `reportDate`：数组需序列化为 `JSON.stringify([start,end])` 以兼容后端形态
 * - 指标构造：依据 `financialVariants[variant].metricSets` 的键在原始行中抽取并转为 `metrics`
 * - 失败降级：当 `useMockOnError` 为 true 时返回 Mock 数据，避免阻断渲染
 */
import { createRequest } from '@/api/request'
import { createMockFinancialData } from '../mock/mockFinancialData'

import { FinancialReportSummaryItem, RegionTypeEnum } from 'gel-types'
import { financialVariants } from '../../config/variants'
import type { FinancialData, FinancialQueryParams } from '../../types'

export const createFinancialDataClient = (config: { timeout: number; useMockOnError?: boolean }) => {
  const fetchFinancialData = async (
    companyCode: string,
    variant: string,
    filters?: Partial<FinancialQueryParams>
  ): Promise<FinancialData> => {
    try {
      const vcfg = financialVariants[variant] || financialVariants.domestic
      const api = createRequest()
      const params: FinancialQueryParams = {
        regionType:
          (filters as any)?.regionType ??
          (variant === 'overseas' ? (RegionTypeEnum as any).OE : (RegionTypeEnum as any).CN),
        reportTemplate: filters.reportTemplate,
        reportType: filters.reportType,
      }
      if (filters?.reportDate && Array.isArray(filters.reportDate)) {
        const [start, end] = filters.reportDate
        params.reportDate = JSON.stringify([start ? Number(start) : null, end ? Number(end) : null]) as any
      }
      const resp = await api('detail/company/financialreportsummary', {
        id: companyCode,
        params,
        noHashParams: true,
      })
      const raw = resp?.Data
      const arr = raw || []

      const periodSet = new Set<string>()
      const periodLabels: Record<string, string> = {}
      const pushPeriods = (arr: FinancialReportSummaryItem[]) => {
        arr.forEach((item) => {
          const base = (item as any)._reportDate as string | undefined
          const periodType = (item as any)._reportPeriod as string | undefined
          if (base) {
            // 使用组合键避免同一天不同报告期被去重
            const key = periodType ? `${base}#${periodType}` : base
            periodSet.add(key)
            if (periodType) periodLabels[key] = String(periodType)
          }
        })
      }
      pushPeriods(arr)
      const periods = Array.from(periodSet)

      const metrics: FinancialData['metrics'] = {}
      const assignValues = (
        set: { key: string; label: string }[],
        arr: Array<Record<string, number | string | null | undefined>>
      ) => {
        set.forEach((m) => {
          const values: Record<string, number | null> = {}
          periods.forEach((p) => {
            const [date, periodType] = p.split('#')
            const found = arr.find((i) => {
              const iDate = (i as any)._reportDate
              const iPeriod = (i as any)._reportPeriod
              if (iDate !== date) return false
              if (periodType && iPeriod !== periodType) return false
              return true
            })
            const raw = found ? (found as Record<string, unknown>)[m.key] : undefined
            const num = typeof raw === 'number' ? raw : raw == null ? null : Number(raw)
            values[p] = Number.isFinite(num as number) ? (num as number) : null
          })
          metrics[m.key] = { label: m.label, values }
        })
      }
      assignValues(vcfg.metricSets.balance, arr)
      assignValues(vcfg.metricSets.profit, arr)
      assignValues(vcfg.metricSets.cash, arr)

      const currencyByPeriod = new Map<string, string | undefined>()
      arr.forEach((item) => {
        const base = (item as any)._reportDate as string | undefined
        const periodType = (item as any)._reportPeriod as string | undefined
        if (base) {
          const key = periodType ? `${base}#${periodType}` : base
          currencyByPeriod.set(key, (item as FinancialReportSummaryItem)._businessProfitDim)
        }
      })
      const firstPeriodCurrency = periods.length ? currencyByPeriod.get(periods[0]) : undefined

      return {
        companyCode,
        periods,
        metrics,
        scenarios: [{ name: 'default' }],
        periodLabels,
        currencyDim: firstPeriodCurrency || (arr?.[0] as FinancialReportSummaryItem | undefined)?._businessProfitDim,
      }
    } catch (error) {
      if (config.useMockOnError) {
        return createMockFinancialData(companyCode)
      }
      throw error
    }
  }

  return {
    fetchFinancialData,
  }
}
