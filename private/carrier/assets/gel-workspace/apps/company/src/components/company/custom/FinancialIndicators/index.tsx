import { createRequest } from '@/api/request'
import {
  domesticIndicatorMetrics,
  overseasIndicatorMetrics,
} from '@/components/company/buss/financial/config/indicatorMetrics'
import { FilterBar } from '@/components/company/buss/financial/presentation/components/FilterBar'
import { FinancialTable } from '@/components/company/buss/financial/presentation/components/FinancialTable'
import type { FinancialFilters, FinancialTableRow, TableModel } from '@/components/company/buss/financial/types'
import { CorpSubModuleCfg } from '@/types/corpDetail'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum'
import { InfoCircleO } from '@wind/icons'
import { Skeleton, Tooltip } from '@wind/wind-ui'
import { useInViewport, useRequest } from 'ahooks'
import dayjs from 'dayjs'
import { FinancialIndicatorItem, FinancialReportIndicatorProps, RegionTypeEnum } from 'gel-types'
import { t } from 'gel-util/intl'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

type IndicatorRow = { reportDate: string; tooltip?: string }
type IndicatorValues = Record<string, number | null>

interface FinancialIndicatorsProps {
  subCfg: CorpSubModuleCfg
  companycode: string
  companyname: string
  basicNum: CorpBasicNumFront
  moduleKey: string
  corpId: string
}

export const FinancialIndicators: FC<FinancialIndicatorsProps> = ({ subCfg, corpId, moduleKey, basicNum }) => {
  const [region, setRegion] = useState<'domestic' | 'overseas'>(() => {
    if (basicNum?.domesticFinancialReportNum === 0 && basicNum?.overseasFinancialReportNum > 0) {
      return 'overseas'
    }
    return 'domestic'
  })
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [inViewport] = useInViewport(containerRef, { threshold: 0.1 })

  // Flag to indicate if we are switching regions (requires full Skeleton)
  const [isRegionLoading, setIsRegionLoading] = useState(true)
  const shouldBackfillDateRef = useRef(true)

  const [filters, setFilters] = useState<FinancialFilters>({
    scenarioIdx: 0,
    unitScale: 'TEN_THOUSAND',
    hideEmptyRows: true,
    reportDate: [undefined, undefined],
    regionType: region === 'overseas' ? RegionTypeEnum.OE : RegionTypeEnum.CN,
  })

  const getFinancialIndicators = async (p: FinancialReportIndicatorProps) => {
    const api = createRequest()
    const resp = await api('/detail/company/financialIndicatorV3', {
      id: corpId,
      params: p,
      noHashParams: true,
    })
    return resp
  }

  const {
    data: resp,
    loading,
    run,
  } = useRequest(getFinancialIndicators, {
    manual: true,
    onSuccess: (res) => {
      const data = res?.data ?? res?.Data
      if (shouldBackfillDateRef.current && data?.aggregations?.reportDate?.value?.length) {
        const dates = data.aggregations.reportDate.value
        const years = dates.map((d: string) => dayjs(d).year()).filter((y: number) => !isNaN(y))
        if (years.length) {
          const min = Math.min(...years)
          const max = Math.max(...years)
          setFilters((prev) => ({ ...prev, reportDate: [min, max] }))
        }
        shouldBackfillDateRef.current = false
      }
    },
    onFinally: () => {
      setIsRegionLoading(false)
    },
  })

  // Initialize viewport
  useEffect(() => {
    if (inViewport) setReady(true)
  }, [inViewport])

  // Handle Region Change Event
  useEffect(() => {
    const onRegion = (e: Event) => {
      const v = (e as CustomEvent<{ variant?: 'overseas' | 'domestic' }>).detail?.variant
      if (v === 'overseas' || v === 'domestic') {
        setRegion(v)
        setIsRegionLoading(true) // Trigger skeleton on region switch
        shouldBackfillDateRef.current = true
      }
    }
    window.addEventListener('financial:variantChanged', onRegion as EventListener)
    return () => window.removeEventListener('financial:variantChanged', onRegion as EventListener)
  }, [])

  // Trigger Data Fetch
  useEffect(() => {
    if (!ready) return

    const params: FinancialReportIndicatorProps = {
      regionType: region === 'overseas' ? RegionTypeEnum.OE : RegionTypeEnum.CN,
    }

    if (Array.isArray(filters.reportDate)) {
      const [start, end] = filters.reportDate
      const s = start ? Number(String(start).slice(0, 4)) : null
      const e = end ? Number(String(end).slice(0, 4)) : null
      params.reportDate = JSON.stringify([s, e]) as any
    }

    run(params)
  }, [region, filters.reportDate, ready])

  // Data Processing & Model Construction
  const model = useMemo<TableModel>(() => {
    console.log('🚀 ~ FinancialIndicators ~ resp:', resp)
    try {
      const dataRaw = resp?.data ?? resp?.Data
      const data = Array.isArray(dataRaw) ? dataRaw : Array.isArray(dataRaw?.list) ? dataRaw.list : []

      if (!data.length) {
        return { columns: [], rows: [], meta: filters, periodLabels: {} }
      }

      const isOverseas = region === 'overseas'
      const metricList = isOverseas ? overseasIndicatorMetrics : domesticIndicatorMetrics

      const defaultData: IndicatorRow[] = metricList.map((m) => ({ reportDate: m.label, tooltip: m.tooltip }))
      const indexArr: string[] = metricList.map((m) => m.key)

      const periods = data.map((d) => String(d._reportDate))
      const periodLabels: Record<string, string> = {}
      const itemByPeriod = new Map<string, FinancialIndicatorItem>()

      data.forEach((item) => {
        const base = String(item._reportDate || '')
        const label = String(item._reportPeriod || '')
        if (base && label) periodLabels[base] = label
        if (base) itemByPeriod.set(base, item)
      })

      let rows: FinancialTableRow[] = defaultData.map((row, idx) => {
        const metricKey = indexArr[idx]
        const valuesEntries = periods.map((periodKey) => {
          const item = itemByPeriod.get(periodKey)
          const raw = item ? (item as any)[metricKey] : undefined

          // Normalize number
          let val: number | null = null
          if (typeof raw === 'number') {
            val = raw
          } else if (raw != null && raw !== '--' && raw !== '') {
            const parsed = Number(raw)
            if (Number.isFinite(parsed)) val = parsed
          }

          return [periodKey, val] as const
        })
        const values: IndicatorValues = Object.fromEntries(valuesEntries)
        return { key: `${metricKey}_Raw`, label: row.reportDate, values, tooltip: row.tooltip }
      })

      if (filters.hideEmptyRows) {
        rows = rows.filter((row) => {
          return periods.some((p) => {
            const v = row.values[p]
            return v !== null && v !== undefined
          })
        })
      }

      return { columns: periods, rows, meta: filters, periodLabels }
    } catch (e) {
      return { columns: [], rows: [], periodLabels: {} }
    }
  }, [resp, region, filters.hideEmptyRows, filters.unitScale])

  const handleFiltersChange = (updates: Partial<FinancialFilters>) => {
    const next: FinancialFilters = { ...filters, ...updates }
    const v = updates.reportDate
    if (typeof updates.reportDate !== 'undefined') {
      try {
        const start = Array.isArray(v) && v[0] ? Number(dayjs(v[0]).format('YYYY')) : undefined
        const end = Array.isArray(v) && v[1] ? Number(dayjs(v[1]).format('YYYY')) : undefined
        next.reportDate = [start ?? null, end ?? null]
      } catch {
        next.reportDate = [undefined, undefined]
      }
    }
    setFilters(next)
  }

  const variant = region === 'overseas' ? 'overseas' : 'domestic'
  const showFilterBar =
    (region === 'overseas' && basicNum?.overseasFinancialReportNum > 0) ||
    (region !== 'overseas' && basicNum?.domesticFinancialReportNum > 0)

  return (
    <div ref={containerRef} data-custom-id={moduleKey} id={moduleKey}>
      {ready ? (
        isRegionLoading && loading ? (
          <div style={{ height: 300, width: '100%', marginBlockStart: 8 }}>
            <Skeleton animation />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0' }}>
              <div style={{ fontSize: 16, fontWeight: 600, minWidth: 'fit-content' }}>
                {subCfg.title}{' '}
                <Tooltip title={t('479134', '财务指标按累计报口径计算')}>
                  {/* @ts-expect-error icon报错 */}
                  <InfoCircleO />
                </Tooltip>
              </div>
              {showFilterBar && (
                <FilterBar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  variant={variant}
                  fields={{
                    reportTemplate: false,
                    reportType: false,
                    unitScale: false,
                    hideEmptyRows: true,
                  }}
                />
              )}
            </div>
            <FinancialTable model={model} dataLoaded={!loading} />
          </>
        )
      ) : (
        <div style={{ height: 300, width: '100%' }} />
      )}
    </div>
  )
}
