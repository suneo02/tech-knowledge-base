import React from 'react'
import { Line, Bar, Area, Pie } from '@ant-design/plots'
import type { ChartData } from './types'
import './styles.less'

/**
 * 获取图表配置
 */
const getChartConfig = (chartData: ChartData) => {
  const { data, config = {} } = chartData
  const { labels, values, series = 'Value' } = data

  // 转换数据格式为 G2 需要的格式
  const chartValues = labels.map((label, index) => ({
    label,
    value: values[index],
    series,
  }))

  const commonConfig = {
    data: chartValues,
    xField: 'label',
    yField: 'value',
    seriesField: 'series',
    color: config.color,
    title: config.title && {
      text: config.title,
      style: { fontSize: 16, fontWeight: 600 },
    },
    legend: config.showLegend !== false && {
      position: 'top' as const,
    },
    xAxis: {
      title: config.xAxisTitle && { text: config.xAxisTitle },
    },
    yAxis: {
      title: config.yAxisTitle && { text: config.yAxisTitle },
    },
  }

  return commonConfig
}

/**
 * 图表组件
 */
export const ChartComponent: React.FC<{
  chartData: ChartData
}> = ({ chartData }) => {
  const config = getChartConfig(chartData)

  const renderChart = () => {
    switch (chartData.type) {
      case 'line':
        return <Line {...config} smooth />
      case 'bar':
        return <Bar {...config} />
      case 'area':
        return <Area {...config} />
      case 'pie':
        return <Pie {...config} angleField="value" colorField="label" radius={0.8} label={{ type: 'outer' }} />
      default:
        return <div>Unsupported chart type: {chartData.type}</div>
    }
  }

  return <div className="markdown-chart-container">{renderChart()}</div>
}
