import { FinancialFiltersProvider } from '@/components/company/buss/financial/application/contexts/financialFilters'
import {
  createConfigProvider,
  createFinancialStatementService,
} from '@/components/company/buss/financial/application/services/financialStatementService'
import { financialVariants } from '@/components/company/buss/financial/config/variants'
import { createFinancialDataClient } from '@/components/company/buss/financial/infrastructure/api/financialDataClient'
import { createFinancialFiltersClient } from '@/components/company/buss/financial/infrastructure/api/financialFiltersClient'
import { FinancialStatement } from '@/components/company/buss/financial/presentation/components/FinancialStatement'
import { useInViewport } from 'ahooks'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { FinancialDataRegion } from '../../buss/financial/FinancialDataRegionToggle'
import { CorpBasicNumFront } from '@/types/corpDetail/basicNum'
import styles from './index.module.less'

interface FinancialStatementsProps {
  companyCode: string
  basicNum: CorpBasicNumFront
  baseURL?: string
  timeoutMs?: number
  className?: string
}

export const FinancialStatements: FC<FinancialStatementsProps> = ({
  companyCode,
  basicNum,
  timeoutMs = 5000,
  className,
}) => {
  const [variant, setVariant] = useState<FinancialDataRegion>(() => {
    if (basicNum?.domesticFinancialReportNum === 0 && basicNum?.overseasFinancialReportNum > 0) {
      return FinancialDataRegion.OVERSEAS
    }
    return FinancialDataRegion.DOMESTIC
  })
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [inViewport] = useInViewport(containerRef, { threshold: 0.1 })

  const dataClient = useMemo(() => createFinancialDataClient({ timeout: timeoutMs, useMockOnError: true }), [timeoutMs])
  const configProvider = useMemo(() => createConfigProvider(financialVariants), [])
  const filtersClient = useMemo(() => createFinancialFiltersClient({ timeout: timeoutMs }), [timeoutMs])
  const service = useMemo(
    () => createFinancialStatementService(dataClient, filtersClient, configProvider),
    [dataClient, filtersClient, configProvider]
  )

  useEffect(() => {
    const onRegion = (e: any) => {
      const v = e?.detail?.variant
      const code = e?.detail?.companycode
      if (code && code !== companyCode) return
      if (v === FinancialDataRegion.OVERSEAS) setVariant(FinancialDataRegion.OVERSEAS)
      if (v === FinancialDataRegion.DOMESTIC) setVariant(FinancialDataRegion.DOMESTIC)
    }
    window.addEventListener('financial:variantChanged', onRegion as any)
    return () => window.removeEventListener('financial:variantChanged', onRegion as any)
  }, [companyCode])

  useEffect(() => {
    if (inViewport) setReady(true)
  }, [inViewport])

  return (
    <div
      ref={containerRef}
      className={`${styles['financial-statements-container']} ${className || ''}`}
      data-custom-id={'FinancialData'}
    >
      {ready ? (
        <FinancialFiltersProvider>
          <FinancialStatement companyCode={companyCode} variant={variant} service={service} basicNum={basicNum} />
        </FinancialFiltersProvider>
      ) : (
        <div style={{ height: 420, width: '100%' }}></div>
      )}
    </div>
  )
}

export default FinancialStatements
