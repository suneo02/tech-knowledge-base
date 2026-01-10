/**
 * 组合服务的请求 Hook：基于 `useRequest` 封装财务报表数据拉取与缓存键管理。
 * @author yxlu.calvin
 * @example
 * const useFinancialStatement = createUseFinancialStatement(service)
 * const { data, loading, error } = useFinancialStatement('600000', 'domestic', { reportTemplate: '年报&累计报' })
 */
import { useRequest } from 'ahooks'
import { createFinancialStatementService } from '../services/financialStatementService'
import type { FinancialVariant, FinancialQueryParams } from '../../types'

export const createUseFinancialStatement = (service: ReturnType<typeof createFinancialStatementService>) => {
  const useFinancialStatement = (
    companyCode: string,
    variant: FinancialVariant,
    filters?: Partial<FinancialQueryParams>,
    ready?: boolean
  ) => {
    const req = useRequest(() => service.getStatement(companyCode, variant, filters), {
      ready: !!companyCode && !!variant && (typeof ready === 'undefined' ? true : !!ready),
      cacheKey: `financial-statement:${companyCode}:${variant}:${String(filters?.reportTemplate ?? '')}:${String(
        filters?.reportType ?? ''
      )}:${String(filters?.reportDate?.[0] ?? '')}-${String(filters?.reportDate?.[1] ?? '')}`,
      cacheTime: 10 * 60 * 1000,
      retryCount: 0,
      refreshDeps: [
        companyCode,
        variant,
        filters.regionType,
        filters.reportTemplate,
        filters.reportType,
        filters.reportDate,
      ],
    })

    return {
      data: req.data,
      error: req.error,
      loading: req.loading,
      refresh: req.refresh,
    }
  }

  return useFinancialStatement
}
