import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '@wind/wind-ui'
import { isEn } from 'gel-util/intl'
import { renderToString } from 'react-dom/server'
import { Map as WindMap, Polygon } from '@wind/Wind.Map.mini'
import { DEFAULT_HEIGHT, MAP_STYLE } from '../config/regionDistribution'
import styles from './RegionMap.module.less'

interface RegionItem {
  regionCode: string
  regionName: string
  winCount: number
  winAmount?: number
}

interface SelectedArea {
  oldCode: string | null
  name: string
  code?: string
}

interface RegionMapProps {
  data: RegionItem[]
  height?: number
  valueKey?: 'winCount' | 'winAmount'
  onSelectRegion?: (regionCode: string, regionName: string) => void
  selectedArea?: SelectedArea
  className?: string
}

export const RegionMap: React.FC<RegionMapProps> = ({
  data,
  height = DEFAULT_HEIGHT,
  valueKey = 'winCount',
  onSelectRegion,
  selectedArea,
  className,
}) => {
  const unitText = valueKey === 'winAmount' ? (isEn() ? '10K Yuan' : '万元') : isEn() ? 'Count' : '次数'

  const [batch, setBatch] = useState<{ code: string; direction: string }>({ code: '156000000', direction: '2' })

  useEffect(() => {
    const direction = selectedArea?.oldCode ? 'down' : '2'
    const code = selectedArea?.oldCode || '156000000'
    setBatch({ code, direction })
  }, [selectedArea])

  const mapTooltipFormatter = useMemo(
    () => (e: { name?: string; value?: number }) => {
      const titleText = e?.name || ''
      const val = e?.value ?? 0
      return renderToString(
        <Card size="small" title={titleText}>
          <div>
            <span style={{ color: '#333' }}>
              {valueKey === 'winAmount' ? (isEn() ? 'Amount' : '金额') : isEn() ? 'Count' : '次数'}
            </span>
            <span style={{ fontWeight: 'bold', marginInlineStart: 10 }}>
              {val} {unitText}
            </span>
          </div>
        </Card>
      )
    },
    [valueKey, unitText]
  )

  const mapOption = useMemo(
    () => ({
      type: 'polygon',
      style: { ...MAP_STYLE, tooltip: { formatter: mapTooltipFormatter } },
      visible: true,
      layerInfo: { autoFit: true },
      event: {
        click: (e: { geoLevel?: number; area_code?: string; adcode?: string; name?: string }) => {
          if ((e?.geoLevel ?? 0) > 2) return
          if (typeof onSelectRegion === 'function') onSelectRegion(e?.area_code || e?.adcode || '', e?.name || '')
        },
      },
    }),
    [mapTooltipFormatter, onSelectRegion]
  )

  const areaHeader = useMemo(() => {
    const display = selectedArea?.name || (isEn() ? 'Nationwide' : '全国')
    return (
      <div className={styles.header}>
        <p className={styles.headerTitle}>{display}</p>
      </div>
    )
  }, [selectedArea])

  return (
    <div className={`${styles.root} ${className || ''}`} style={{ height }}>
      <div className={styles.container}>
        {areaHeader}
        <div className={styles.mapWrap}>
          <WindMap style={{ width: '100%', height: '100%' }} lang={isEn() ? 'en' : 'cn'}>
            <Polygon id="region" {...mapOption} data={data} batch={batch} />
          </WindMap>
        </div>
      </div>
    </div>
  )
}

export type { RegionMapProps, RegionItem, SelectedArea }
