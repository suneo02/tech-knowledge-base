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
