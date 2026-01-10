import React, { useMemo } from 'react'
import { isEn } from 'gel-util/intl'
import { WCBChart } from '@wind/chart-builder'
import { WCB_BAR_BASE_CONFIG } from '../config/regionDistribution'
import styles from './RegionBarChart.module.less'

interface RegionBarData {
  regionName: string
  winCount: number
  winAmount?: number
}

interface RegionBarChartProps {
  data: RegionBarData[]
  height?: number
  valueKey?: 'winCount' | 'winAmount'
  topN?: number
  title?: string
  className?: string
}

export const RegionBarChart: React.FC<RegionBarChartProps> = ({
  data,
  height,
  valueKey = 'winCount',
  topN = 10,
  title,
  className,
}) => {
  const unitText = valueKey === 'winAmount' ? (isEn() ? '10K Yuan' : '万元') : isEn() ? 'Count' : '次数'

  const topData = useMemo(() => {
    const list = (data || []).slice(0, topN)
    const names = list.map((i) => i.regionName)
    const values = list.map((i) => Math.max(0, valueKey === 'winCount' ? i.winCount : i.winAmount || 0))
    return {
      names: [...names].reverse(),
      values: [...values].reverse(),
    }
  }, [data, topN, valueKey])

  const barChartData = useMemo(() => {
    const chartData: Record<string, number> = {}
    topData.names.forEach((n, idx) => {
      chartData[n] = topData.values[idx] || 0
    })
    return chartData
  }, [topData])

  const barMeta = useMemo(
    () => ({
      name: valueKey === 'winAmount' ? (isEn() ? 'Amount' : '金额') : isEn() ? 'Count' : '次数',
      unit: unitText,
    }),
    [valueKey, unitText]
  )

  return (
    <div className={`${styles.root} ${className || ''}`} style={{ height }}>
      <div className={styles.container}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.chartWrap}>
          <WCBChart
            data={{
              ...WCB_BAR_BASE_CONFIG,
              indicators: [
                {
                  meta: barMeta,
                  data: barChartData,
                },
              ],
            }}
            lang={isEn() ? 'en' : 'cn'}
          />
        </div>
      </div>
    </div>
  )
}

export type { RegionBarChartProps, RegionBarData }
