/**
 * 财务报表服务编排：负责拉取过滤项、请求财务数据、校验并构造领域对象，含内存缓存与预加载能力。
 * @author yxlu.calvin
 * @example
 * const dataClient = createFinancialDataClient({ timeout: 30000 })
 * const filtersClient = createFinancialFiltersClient({ timeout: 30000 })
 * const configProvider = createConfigProvider(financialVariants)
 * const svc = createFinancialStatementService(dataClient, filtersClient, configProvider)
 * const statement = await svc.getStatement('600000', 'domestic', { reportTemplate: '年报&累计报' })
 * @remarks
 * - 缓存键：`companyCode/variant/reportTemplate/reportType/reportDateRange` 组合，避免跨筛选污染
 * - 过滤项合并：优先使用 UI 参数；缺失时使用模板默认值 `'年报&累计报'`
 * - 数据校验：`DataValidator` 对结构与关键字段存在性校验，不做值域验证
 * - 预加载：`preloadStatement` 异步填充缓存，命中后减少初次渲染等待
 */
import { createFinancialStatement } from '../../domain/entities/financialStatement'
import { DataValidator } from '../../domain/services/dataValidator'
import { memoryCache } from '../../infrastructure/cache/memoryCache'
import { createFinancialDataClient } from '../../infrastructure/api/financialDataClient'
import { createFinancialFiltersClient } from '../../infrastructure/api/financialFiltersClient'
import { financialVariants } from '../../config/variants'
import type { FinancialVariant, FinancialQueryParams } from '../../types'
import { t } from 'gel-util/intl'

const STRINGS = {
  DATA_VALIDATION_FAILED: t('', '数据验证失败'),
} as const

export const createFinancialStatementService = (
  dataClient: ReturnType<typeof createFinancialDataClient>,
  filtersClient: ReturnType<typeof createFinancialFiltersClient>,
  configProvider: ReturnType<typeof createConfigProvider>
) => {
  /**
   * 获取服务端过滤项（报告期、类型、默认时间范围）
   */
  const getFilters = async (companyCode: string, variant: FinancialVariant) =>
    filtersClient.fetchFilters(companyCode, variant)

  const getStatement = async (
    companyCode: string,
    variant: FinancialVariant,
    filters?: Partial<FinancialQueryParams>
  ): Promise<ReturnType<typeof createFinancialStatement>> => {
    const cacheKey = `financial-statement:${companyCode}:${variant}:${String(filters?.reportTemplate ?? '')}:${String(
      filters?.reportType ?? ''
    )}:${String(filters?.reportDate?.[0] ?? '')}-${String(filters?.reportDate?.[1] ?? '')}`

    const merged: Partial<FinancialQueryParams> = {}
    const templateCandidate = (filters?.reportTemplate as any) || '年报&累计报'
    merged.reportTemplate = templateCandidate
    const typeCandidate = filters?.reportType as any
    if (typeof typeCandidate !== 'undefined') merged.reportType = typeCandidate as any
    merged.reportDate = filters?.reportDate

    const rawData = await dataClient.fetchFinancialData(companyCode, variant, merged)
    const validation = DataValidator.validateFinancialData(rawData)

    if (!validation.isValid) {
      throw new Error(`${STRINGS.DATA_VALIDATION_FAILED}: ${validation.errors.join(', ')}`)
    }

    // ensure variant is recognized
    configProvider.getVariantConfig(variant)
    const statement = createFinancialStatement(rawData, variant)
    memoryCache.set<ReturnType<typeof createFinancialStatement>>(cacheKey, statement)
    return statement
  }

  const preloadStatement = (companyCode: string, variant: FinancialVariant) => {
    const cacheKey = `financial-statement:${companyCode}:${variant}`
    console.log('🚀 ~ getStatement ~ cacheKey:', cacheKey)

    if (!memoryCache.get(cacheKey)) {
      getStatement(companyCode, variant).catch(console.error)
    }
  }

  return {
    getFilters,
    getStatement,
    preloadStatement,
  }
}
/**
 * 变体配置提供者：提供变体配置查询与指标集合访问。
 * @author yxlu.calvin
 * @example
 * const provider = createConfigProvider(financialVariants)
 * const cfg = provider.getVariantConfig('domestic')
 * const metrics = provider.getMetricsForVariant('domestic')
 */
export const createConfigProvider = (variantsConfig: typeof financialVariants) => {
  const getVariantConfig = (variant: string) => {
    return variantsConfig[variant] || variantsConfig.domestic
  }

  const getAvailableVariants = () => {
    return Object.keys(variantsConfig)
  }

  const getMetricsForVariant = (variant: string) => {
    return getVariantConfig(variant).metrics || []
  }

  return {
    getVariantConfig,
    getAvailableVariants,
    getMetricsForVariant,
  }
}
