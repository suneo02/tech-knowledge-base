/**
 * 财务报表容器组件：负责获取过滤项、驱动数据请求、组装表格模型并渲染筛选与表格。
 * @author yxlu.calvin
 * @example
 * <FinancialFiltersProvider>
 *   <FinancialStatement companyCode="600000" variant="domestic" service={financialService} basicNum={basicNum} />
 * </FinancialFiltersProvider>
 * @remarks
 * - 过滤项阶段：优先拉取服务端默认值与选项，写入上下文后再进行数据请求
 * - 组装行：依据 `financialVariants[variant].metricSets` 构建三组（利润/资产负债/现金流）行
 * - 空行控制：`hideEmptyRows` 仅在客户端进行非空值判断过滤，保留组头
 * - 年份转换：表单返回值使用 `dayjs` 转换为 `YYYY` 年份数字，避免季度/日期混入
 * - 展示条件：`basicNum` 控制筛选条是否展示（境内/境外各自的报表数量判断）
 */
import React, { useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { isEn, t } from 'gel-util/intl'
import { createUseFinancialStatement } from '../../../application/hooks/useFinancialStatement'
import { useFinancialFilters } from '../../../application/contexts/financialFilters'
import { FinancialTable } from './../FinancialTable'
import { FilterBar } from './../FilterBar'
import { LoadingState } from './../LoadingState'
import { ErrorState } from './../ErrorState'
import { createFinancialStatementService } from '../../../application/services/financialStatementService'
import { financialVariants } from '../../../config/variants'
import { groupHeaders } from '../../../config/validatedMetrics'
import type { FinancialFilters, FinancialVariant } from '../../../types'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum'
import styles from './index.module.less'
import type { OptionProps } from '@wind/wind-ui/lib/select'
import dayjs, { Dayjs } from 'dayjs'
import { Checkbox, Skeleton } from '@wind/wind-ui'
import { ReportTemplateType, ReportTypeEnum } from 'gel-types'

const PREFIX = 'financial-statement'
const STRINGS = {
  HEADER_TITLE: t('2295', '财务报表'),
  SUB_HEADER_TITLE: t('2045', '币种'),
  HIDE_EMPTY_ROWS: t('16421', '隐藏空行'),
} as const

export const FinancialStatement: React.FC<{
  companyCode: string
  variant: keyof typeof financialVariants
  service: ReturnType<typeof createFinancialStatementService>
  basicNum: CorpBasicNumFront
}> = ({ companyCode, variant, service, basicNum }) => {
  const useFinancialStatementHook = createUseFinancialStatement(service)
  const { filters, updateFilters } = useFinancialFilters()
  const [filtersReady, setFiltersReady] = useState(false)
  const readyVariantRef = React.useRef(variant)
  const {
    data: statement,
    loading,
    error,
    refresh,
  } = useFinancialStatementHook(companyCode, variant, filters, filtersReady && readyVariantRef.current === variant)
  const [serverOptions, setServerOptions] = useState<
    | {
        reportTemplate?: OptionProps[]
        reportType?: OptionProps[]
      }
    | undefined
  >()

  const { loading: pageLoading } = useRequest(() => service.getFilters(companyCode, variant as any), {
    ready: !!companyCode && !!variant,
    refreshDeps: [companyCode, variant],
    onSuccess: (remote) => {
      console.log('🚀 ~ FinancialStatement ~ remote:', remote)
      setServerOptions({
        reportTemplate: Array.isArray(remote.reportTemplate?.options)
          ? remote.reportTemplate!.options!.map((v) => ({ label: v.label!, value: v.value }))
          : [],
        reportType: Array.isArray(remote.reportType?.options)
          ? remote.reportType!.options!.map((v) => ({ label: v.label!, value: v.value }))
          : [],
      })
      const updates: Partial<FinancialFilters> = {}

      if (remote.reportTemplate?.value) updates.reportTemplate = remote.reportTemplate.value as ReportTemplateType
      if (remote.reportType?.value) updates.reportType = remote.reportType.value as ReportTypeEnum
      if (remote.reportDate?.value && Array.isArray(remote.reportDate.value)) {
        const [start, end] = remote.reportDate.value
        const toYear = (v: unknown): string | undefined => {
          const s = typeof v === 'string' ? v : v != null ? String(v) : ''
          const m = s.match(/^\d{4}/)
          return m ? m[0] : undefined
        }
        const sYear = toYear(start)
        const eYear = toYear(end)
        updates.reportDate = [sYear, eYear] as any
      }
      console.log('🚀 ~ FinancialStatement ~ updates:', updates)
      if (Object.keys(updates).length) {
        updateFilters(updates as any)
      }
      readyVariantRef.current = variant
      setFiltersReady(true)
    },
  })

  React.useEffect(() => {
    setFiltersReady(false)
    readyVariantRef.current = variant
  }, [companyCode, variant])

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const periods = useMemo(
    () => (statement ? statement.getPeriodsInRange(filters.reportDate?.[0], filters.reportDate?.[1]) : []),
    [statement, filters.reportDate]
  )
  function makeRows() {
    const vcfg = financialVariants[variant]
    const profitSet = vcfg.metricSets.profit
    const balanceSet = vcfg.metricSets.balance
    const cashSet = vcfg.metricSets.cash

    const balanceRows = balanceSet.map((m) => ({
      key: m.key,
      label: m.label,
      values: Object.fromEntries(periods.map((p) => [p, statement!.getMetricValue(m.key, p)])),
      __group: 'balance',
    }))
    const profitRows = profitSet.map((m) => ({
      key: m.key,
      label: m.label,
      values: Object.fromEntries(periods.map((p) => [p, statement!.getMetricValue(m.key, p)])),
      __group: 'profit',
    }))
    const cashRows = cashSet.map((m) => ({
      key: m.key,
      label: m.label,
      values: Object.fromEntries(periods.map((p) => [p, statement!.getMetricValue(m.key, p)])),
      __group: 'cash',
    }))
    const headerStyles = {
      balance: { __bg: 'var(--basic-14)' },
      profit: { __bg: 'var(--basic-14)' },
      cash: { __bg: 'var(--basic-14)' },
    }
    const order = (vcfg.table as any)?.groupOrder || ['balance', 'profit', 'cash']
    if (!filters.hideEmptyRows) {
      const map: Record<string, any[]> = { profit: profitRows, balance: balanceRows, cash: cashRows }
      const res: any[] = []
      order.forEach((g) => {
        const header = (groupHeaders as any)[g]
        const style = (headerStyles as any)[g]
        res.push({ ...header, ...style }, ...map[g])
      })
      return res
    }
    const isNonEmpty = (row: any) => {
      return periods.some((p) => {
        const v = row.values?.[p]
        if (v === undefined || v === null || v === '') return false
        if (typeof v === 'number' && Number.isNaN(v)) return false
        return true
      })
    }
    const pr = profitRows.filter(isNonEmpty)
    const br = balanceRows.filter(isNonEmpty)
    const cr = cashRows.filter(isNonEmpty)
    const mapFiltered: Record<string, any[]> = { profit: pr, balance: br, cash: cr }
    const combined: any[] = []
    order.forEach((g) => {
      const rows = mapFiltered[g]
      if (rows.length) {
        const header = (groupHeaders as any)[g]
        const style = (headerStyles as any)[g]
        combined.push({ ...header, ...style }, ...rows)
      }
    })
    return combined
  }

  const combinedRows = useMemo(
    () => (statement ? makeRows() : []),
    [statement, periods, filters.hideEmptyRows, filters.unitScale, variant]
  )

  if (error) {
    return <ErrorState error={error} onRetry={() => refresh()} />
  }

  if (loading && !statement) {
    return (
      <div className={styles[`${PREFIX}-skeleton-container`]}>
        <Skeleton animation />
      </div>
    )
  }

  const tableModel = {
    columns: periods,
    rows: combinedRows,
    meta: {
      unitScale: filters.unitScale,
      scenario: undefined,
    },
    periodLabels: Object.fromEntries(periods.map((p) => [p, statement.getPeriodLabel(p) || ''])),
  }

  const handleFiltersFormChange = (values: FinancialFilters) => {
    const updates: FinancialFilters = {}
    if (values.unitScale) updates.unitScale = values.unitScale
    if (typeof values.hideEmptyRows !== 'undefined') updates.hideEmptyRows = !!values.hideEmptyRows
    if (values.reportTemplate) updates.reportTemplate = values.reportTemplate
    if (values.reportType) updates.reportType = values.reportType
    if (values.reportDate) {
      const v = values.reportDate
      try {
        const start = Array.isArray(v) && v[0] ? Number(dayjs(v[0]).format('YYYY')) : undefined
        const end = Array.isArray(v) && v[1] ? Number(dayjs(v[1]).format('YYYY')) : undefined
        updates.reportDate = [start || null, end || null] as [number | null, number | null]
      } catch {
        updates.reportDate = [undefined, undefined]
      }
    }
    updateFilters(updates)
  }

  // 专门针对隐藏空行来解决空行问题
  const hideEmptyRows = () => {
    updateFilters({ hideEmptyRows: !filters.hideEmptyRows })
  }

  const showFilterBar =
    variant === 'overseas' ? basicNum?.overseasFinancialReportNum > 0 : basicNum?.domesticFinancialReportNum > 0

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {pageLoading ? (
        <div className={styles[`${PREFIX}-skeleton-container`]}>
          <Skeleton animation />
        </div>
      ) : (
        <>
          <div className={styles[`${PREFIX}-header`]}>
            <div className={styles[`${PREFIX}-header-title`]}>{STRINGS.HEADER_TITLE}</div>
            {showFilterBar && (
              <FilterBar
                filters={filters}
                onFiltersChange={handleFiltersFormChange}
                variant={variant}
                options={{ reportTemplate: serverOptions?.reportTemplate, reportType: serverOptions?.reportType }}
              />
            )}
          </div>
          <div className={styles[`${PREFIX}-sub-header`]}>
            <div className={styles[`${PREFIX}-sub-header-title`]}>
              {STRINGS.SUB_HEADER_TITLE}
              {isEn() ? ':' : '：'} {statement?.currencyDim || '人民币'}
            </div>
            <div>
              <Checkbox checked={!!filters.hideEmptyRows} onChange={hideEmptyRows}>
                {STRINGS.HIDE_EMPTY_ROWS}
              </Checkbox>
            </div>
          </div>

          <div className={styles[`${PREFIX}-content`]}>
            <FinancialTable
              model={tableModel as any}
              eachTableKey="FinancialData"
              dataLoaded={!loading}
              className="vtable-container"
              hoveredGroup={hoveredGroup}
              onGroupHover={setHoveredGroup}
              onRowClick={(row) => console.log('Row clicked:', row)}
            />
          </div>
        </>
      )}
    </div>
  )
}
