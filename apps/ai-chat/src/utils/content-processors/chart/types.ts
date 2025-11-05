/**
 * 图表数据接口
 * 用于存储图表的配置和数据
 */
export interface ChartData {
  /** 图表类型 */
  type: 'line' | 'bar' | 'pie' | 'area'
  /** 图表数据 */
  data: {
    /** X轴标签 */
    labels: string[]
    /** Y轴数据 */
    values: number[]
    /** 数据系列名称（可选） */
    series?: string
  }
  /** 图表配置（可选） */
  config?: {
    /** 标题 */
    title?: string
    /** X轴标题 */
    xAxisTitle?: string
    /** Y轴标题 */
    yAxisTitle?: string
    /** 是否显示图例 */
    showLegend?: boolean
    /** 自定义颜色 */
    color?: string
  }
}
