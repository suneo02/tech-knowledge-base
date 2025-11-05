// import { getServerApiByConfig } from '@/api/serverApi'
import { memo } from 'react'
import ComposeChart from './ComposeChart'

export enum ChartType {
  BAR = 'bar',
  LINE = 'line',
  PIE = 'pie',
  SCATTER = 'scatter',
  AREA = 'area',
}

export type ChartProps = {
  indicators: {
    meta: {
      name: string // 指标名称
      unit: string // 指标单位
      uuid?: string // 指标ID
      type?: ChartType // 图表类型
      frequency?: string // 指标频率
    }
    data: Record<string, number>
  }[]
  hideLabel?: boolean
  hideLegend?: boolean
  width?: string
  height?: string
  [key: string]: any
}

const WCB_Raw = ({ indicators, width, height, ...rest }: ChartProps) => {
  return (
    <div style={{ width: width || '100%', height: height || 300 }}>
      <ComposeChart indicators={indicators} {...rest} />
    </div>
  )
}

const WCB = memo(WCB_Raw)

WCB.displayName = 'WindChartBarOrPie'

export { WCB }
