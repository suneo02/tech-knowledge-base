import { FC, useMemo, useEffect, useRef, useState } from 'react'
import styles from './style/chartBase.module.less'

import { GelCardTypeEnum, WindSessionHeader } from 'gel-api'
import { generateUrlByModule, KGLinkActiveKeyEnum, LinkModule } from 'gel-util/link'

interface ChartUrlResult {
  url: string | undefined
  fullUrl: string | undefined
  functionCode?: string
}

// 基础参数配置
const getBaseParams = (companyCode: string, wsid: string) => ({
  snapshot: '1' as const,
  linksource: 'pcai' as const,
  notoolbar: '1' as const,
  companycode: companyCode,
  [WindSessionHeader]: wsid,
})

export const useChartUrl = (
  type: GelCardTypeEnum,
  companyCode: string,
  wsid: string,
  isDev: boolean
): ChartUrlResult => {
  return useMemo(() => {
    const baseParams = getBaseParams(companyCode, wsid)

    switch (type) {
      case GelCardTypeEnum.ChartEquityPenetration:
      case GelCardTypeEnum.ChartGqct: {
        const url = generateUrlByModule({
          module: LinkModule.GQCT_CHART,
          params: baseParams,
          isDev,
        })

        const fullUrl = generateUrlByModule({
          module: LinkModule.KG_PLATFORM,
          params: {
            activeKey: KGLinkActiveKeyEnum.chart_gqct,
            isSeparate: '1',
            ...baseParams,
          },
          isDev,
        })
        return { url, fullUrl, functionCode: '922610370012' }
      }

      case GelCardTypeEnum.ChartActualController: {
        const url = generateUrlByModule({
          module: LinkModule.ACTUAL_CONTROLLER_CHART,
          params: baseParams,
          isDev,
        })

        const fullUrl = generateUrlByModule({
          module: LinkModule.KG_PLATFORM,
          params: {
            activeKey: KGLinkActiveKeyEnum.chart_yskzr,
            isSeparate: '1',
            ...baseParams,
          },
          isDev,
        })
        return { url, fullUrl }
      }
      case GelCardTypeEnum.ChartBeneficiaryNaturalPerson:
      case GelCardTypeEnum.ChartBeneficiaryInstitution:
      case GelCardTypeEnum.ChartBeneficialOwner: {
        const url = generateUrlByModule({
          module: LinkModule.BENEFICIAL_CHART,
          params: baseParams,
          isDev,
        })
        const fullUrl = generateUrlByModule({
          module: LinkModule.KG_PLATFORM,
          params: {
            activeKey: KGLinkActiveKeyEnum.chart_qysyr,
            isSeparate: '1',
            ...baseParams,
          },
          isDev,
        })
        return { url, fullUrl }
      }
      case GelCardTypeEnum.ChartCorrelationParty2:
      case GelCardTypeEnum.ChartCorrelationParty: {
        const url = generateUrlByModule({
          module: LinkModule.CORRELATION_CHART,
          params: baseParams,
          isDev,
        })
        const fullUrl = generateUrlByModule({
          module: LinkModule.KG_PLATFORM,
          params: {
            activeKey: KGLinkActiveKeyEnum.chart_glgx,
            isSeparate: '1',
            ...baseParams,
          },
          isDev,
        })
        return { url, fullUrl }
      }
      default:
        return { url: undefined, fullUrl: undefined }
    }
  }, [type, companyCode])
}

export const ChartComp: FC<{
  url: string | undefined
  onClick: () => void
  style?: React.CSSProperties
}> = ({ url, onClick, style }) => {
  const [key, setKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // 监听容器宽度变化刷新iframe
  useEffect(() => {
    const container = document.getElementById('company-detail-ai-right-container')
    if (!container || !url) return

    // 创建 ResizeObserver 监听容器宽度变化
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        // 当宽度变化时，通过改变key来刷新iframe
        setKey((prev) => prev + 1)
      }
    })

    resizeObserver.observe(container)
    resizeObserverRef.current = resizeObserver

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [url])

  if (!url) return null

  return (
    <div ref={containerRef} className={styles.chartContainer}>
      <iframe key={key} src={url} onClick={onClick} className={styles.chartFrame} style={style} />
    </div>
  )
}
